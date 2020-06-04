import express, { request, response } from 'express';
import knex from './database/connection';
import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get('/point', pointsController.index);

routes.post('/point', pointsController.create);

routes.get('/point/:id', pointsController.show);

export default routes;