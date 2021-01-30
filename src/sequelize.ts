import { Sequelize } from 'sequelize';
import { init } from './models';

const databaseConfig = ():
    | { dialect: 'sqlite'; storage: string }
    | {
          dialect: 'mysql';
          host: string;
          port: number;
          database: string;
          username: string;
          password?: string;
      } => {
    if (process.env.NODE_ENV === 'test')
        return {
            dialect: 'sqlite',
            storage: ':memory:',
        };
    return {
        dialect: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
        database: process.env.DB_SCHEMA || 'db',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASS,
    };
};

export default async function sequelize(force = false) {
    const sequelize = new Sequelize({
        logging: false,
        define: {
            freezeTableName: true,
        },
        sync: {
            force,
        },
        ...databaseConfig(),
    });

    await init(sequelize, force);

    return sequelize;
}
