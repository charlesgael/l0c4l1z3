import compression from 'compression';

import serveFavicon from 'serve-favicon';

import cacheManager from 'cache-manager';

import expressCacheMiddleware from 'express-cache-middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import crud, { sequelizeCrud } from 'express-sequelize-crud';
import flat from 'flat';
import helmet from 'helmet';
import httpErrors, { HttpError } from 'http-errors';
import morgan from 'morgan';
import path from 'path';
import Sequelize from 'sequelize';
import { Entry } from './models/Entry';
import { Language } from './models/Language';
import { Namespace } from './models/Namespace';
import sequelize from './sequelize';

dotenv.config();

console.log('Startup sequence...');
sequelize()
    .then(() => {
        console.log('Database ok starting server...');

        const app = express();
        app.use(compression());
        app.use(morgan('common'));
        app.use(
            helmet(
                process.env.CDN !== undefined
                    ? {
                          contentSecurityPolicy: {
                              directives: {
                                  defaultSrc: ["'self'"],
                                  scriptSrc: ["'self'"],
                                  styleSrc: ["'self'", "'unsafe-inline'"],
                                  imgSrc: ["'self'"],
                                  connectSrc: ["'self'"],
                                  fontSrc: ["'self'"],
                                  objectSrc: ["'self'"],
                                  mediaSrc: ["'self'"],
                                  frameSrc: ["'self'"],
                              },
                          },
                      }
                    : undefined
            )
        );
        if (process.env.CDN) {
            const cache = new expressCacheMiddleware(
                cacheManager.caching({
                    store: 'memory',
                    max: 10000,
                    ttl: 3600,
                })
            );
            cache.attach(app);
        }
        app.use(cors());
        app.use(serveFavicon(path.join(__dirname, '..', 'build', 'favicon.ico')));

        if (process.env.CDN === undefined) {
            app.use(
                crud('/languages', {
                    ...sequelizeCrud(Language),
                    async getList({ filter, limit, offset, order }) {
                        const where: Record<string, any> = {};
                        if (filter.ns) where.ns = filter.ns;

                        delete filter.ns;

                        const res = await Language.findAndCountAll({
                            where: filter,
                            limit,
                            offset,
                            order,
                        });

                        const total = await Entry.count({
                            col: 'key',
                            distinct: true,
                            where,
                        });

                        res.rows = await Promise.all(
                            res.rows.map(async (row) => {
                                const lines = await Entry.count({
                                    col: 'key',
                                    distinct: true,
                                    where: {
                                        ...where,
                                        lng: row.id,
                                    },
                                });

                                row.setDataValue('lines', lines);
                                row.setDataValue('total', total);

                                return row;
                            })
                        );

                        return res;
                    },
                })
            );
            app.use(crud('/namespaces', sequelizeCrud(Namespace)));
            app.use(crud('/entries', sequelizeCrud(Entry)));
            app.use(
                crud('/missingKeys', {
                    async getList({ filter, order }) {
                        const where: Record<string, any> = {};
                        if (filter.ns) where.ns = filter.ns;

                        const distinct = (
                            await Entry.findAll({
                                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('key')), 'key']],
                                where,
                            })
                        ).map((it) => it.key);

                        const values = (
                            await Entry.findAll({
                                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('key')), 'key']],
                                where: filter,
                                order,
                            })
                        ).map((it) => it.key);

                        const res = distinct
                            .filter((it) => !values.includes(it))
                            .map((key, id) => ++id && { id, key });

                        return {
                            rows: res,
                            count: res.length,
                        };
                    },
                })
            );

            app.use(express.static(path.join(__dirname, '..', 'build')));
            app.get('/', function (req, res) {
                res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
            });
        }

        app.use<{ ns: string; lng: string }>(
            '/api/:ns/:lng.json',
            expressAsyncHandler(async function (req, res) {
                const ns = await Namespace.findOne({
                    where: {
                        code: req.params.ns,
                    },
                });

                if (!ns) throw httpErrors(404, `Namespace not found: '${req.params.ns}'`);

                const lang = await Language.findOne({
                    where: {
                        code: req.params.lng,
                    },
                });

                if (!lang) throw httpErrors(404, `Language not found: '${req.params.lng}'`);

                const entries = await Entry.findAll({
                    where: {
                        ns: ns.id,
                        lng: lang.id,
                    },
                    order: [['key', 'ASC']],
                });

                const result = flat.unflatten(
                    entries.reduce((acc, it) => ({ ...acc, [it.key]: it.value }), {})
                );

                res.status(200).json(result);
            })
        );

        app.use('/all.json', async function (req, res) {
            const namespaces: { [ns: string]: { [key: string]: string } } = (
                await Namespace.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('code')), 'code']],
                })
            ).reduce((acc, it) => ({ ...acc, [it.code]: {} }), {});

            const languages: { [lang: string]: { [ns: string]: { [key: string]: string } } } = (
                await Language.findAll({
                    attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('code')), 'code']],
                })
            ).reduce((acc, it) => ({ ...acc, [it.code]: { ...namespaces } }), {});

            const entries = (await Entry.findAll({
                include: [Language, Namespace],
            })) as (Entry & { Language: Language; Namespace: Namespace })[];

            const result = entries.reduce((acc, it) => {
                acc[it.Language.code][it.Namespace.code][it.key] = it.value;
                return acc;
            }, languages);

            res.status(200).json(flat.unflatten(result));
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
            res.status(err.status).json({ message: err.message });
        });

        app.listen(8080, () => {
            console.log(`Server loaded and listening on 'http://localhost:8080'`);
        });
    })
    .catch((e) => {
        console.error('DB error', e);
    });
