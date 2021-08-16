import { Schema, ValidationErrorItem } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';

function errorResponse(schemaErrors: ValidationErrorItem[]) {
    const errors = schemaErrors.map(({ path, message }: ValidationErrorItem) => ({ path: path[0], message }));

    return {
        status: 'failed',
        errors
    };
}

export function validateUser(schema: Schema): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });

        if (error && error.isJoi) {
            res.status(400).json(errorResponse(error.details));
        } else {
            return next();
        }
    };
}
