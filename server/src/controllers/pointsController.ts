import knex from '../database/connection';
import { Request, Response } from 'express';

class PointsController {

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('point').where('id', id).first();

        if (!point) {
            return response.status(400).json({
                message: 'Point not found'
            });
        };

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.15.19:3333/uploads/${point.image}`
        };

        const item = await knex('items').join('point_items', 'items.id', '=', 'point_items.item_id').where('point_items.point_id', id).select('items.title');

        return response.json({ point: serializedPoint, item });
    };

    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body

        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const insertedIds = await trx('point').insert(point);

        const point_id = insertedIds[0];

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                }
            });

        await trx('point_items').insert(pointItems);

        await trx.commit();

        return response.json({
            id: point_id,
            ...point
        });
    };

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('point')
            .join('point_items', 'point.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('point.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.15.19:3333/uploads/${point.image}`
            };
        });

        if (!points) {
            return response.json({ message: 'Deu ruim' });
        }

        return response.json(serializedPoints);
    }
};

export default PointsController;