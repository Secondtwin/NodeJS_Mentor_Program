import express = require('express');
import { initialize, router } from './api/routing';
import { Sequelize } from 'sequelize';
import { environment } from './config/enviroment';

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
app.use('/api', router);

app.listen(3000, () => {
    initialize(sequelize);
});
