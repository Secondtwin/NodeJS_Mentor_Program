import express = require('express');
import cors = require('cors');
import { initialize, router, userService } from './api/routing';
import { Sequelize } from 'sequelize';
import { environment } from './config/enviroment';
import { logger } from './models';
import { baseLogger, errorHandler } from './utils';
import { NextFunction, Request, Response } from 'express';
import { AuthenticationService } from './services/authentication.service';
import { config } from 'dotenv';

config();

const app = express();
const sequelize = new Sequelize(
    environment.databaseName,
    environment.databaseUser,
    environment.databasePass,
    {
        dialect: 'postgres',
        host: environment.host,
        port: 5432
    });

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
app.use(baseLogger);
app.use('/api', router);

app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { login, password } = req.body;
    try {
        const { login: name, password: pass, id } = await userService.getUserByUsername(login);

        if (password === pass) {
            const token = AuthenticationService.getToken({ name, id });

            res.send(token);
        } else {
            return next(new Error('Wrong user password'));
        }
    } catch (err) {
        return next(err);
    }
});

app.use(errorHandler);

app.listen(3000, () => {
    initialize(sequelize);
});

process.on('uncaughtException', (error: Error) => {
    logger.error(`uncaughtException: ${error.message}`);
    process.exit();
});

process.on('unhandledRejection', (error: Error) => {
    logger.error(`unhandledRejection: ${error.message}`);
    process.exit();
});
