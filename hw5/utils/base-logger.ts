import { NextFunction, Request, Response } from 'express';
import { logger } from '../models';

export function baseLogger(req: Request, res: Response, next: NextFunction): void {
    const params = Object.keys(req.params).length ? Object.keys(req.params).join(', ') : null;
    const body = Object.keys(req.body).length ? mapToKeyValue(req) : null;

    console.log(req.query);
    logger.info(`${ req.method }: ${ req.url }
    ${ params ? `Params: ${params}` : '' }
    ${ body ? `Body: ${body}` : '' }`);
    next();
}

function mapToKeyValue(req: Request) {
    return Object.keys(req.body).reduce((res, key) => {
        return res += `${ key } - ${ req.body[key] }; `;
    }, '');
}
