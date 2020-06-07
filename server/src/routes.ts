import express, { request, response } from 'express';
import knex from './database/connection';
import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';
import multer from 'multer';
import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);



const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get('/point', pointsController.index);

routes.get('/point/:id', pointsController.show);

routes.post('/point', upload.single('image') ,pointsController.create);

export default routes;