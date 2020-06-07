import express, { request, response } from 'express';
import knex from './database/connection';
import PointsController from './controllers/pointsController';
import ItemsController from './controllers/itemsController';
import multer from 'multer';
import multerConfig from './config/multer';
import { celebrate, Joi } from 'celebrate';

const routes = express.Router();
const upload = multer(multerConfig);



const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get('/point', pointsController.index);

routes.get('/point/:id', pointsController.show);

routes.post('/point',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    },{
        abortEarly: false
    }),
    pointsController.create
);

export default routes;