declare module 'express-cache-middleware' {
    import { Application } from 'express';
    import { Cache } from 'cache-manager';

    export default class ExpressCacheMiddleware implements Middleware {
        constructor(cache: Cache);

        attach(application: Application);
    }
}
