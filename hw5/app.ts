import express = require('express');
import { initialize, router } from './api/routing';
import { Sequelize } from 'sequelize';
import { environment } from './config/enviroment';
import { logger } from './models';
import { baseLogger, errorHandler } from './utils';

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
app.use(baseLogger);
app.use('/api', router);
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
