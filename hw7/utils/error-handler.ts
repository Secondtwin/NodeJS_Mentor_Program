import { logger } from '../models';
import { Request, Response } from 'express';

export function errorHandler(err: Error & { status: number, errors: Error[] }, req: Request, res: Response): void {
    const status = err.status || 500;
    const message = err?.errors?.[0].message || err.message || 'Something failed';

    logger.error(`${ req.method }: ${ req.url }; Error: ${ message }`);
    res.status(status).json({ error: { status, message }, httpStatus: status });
}
