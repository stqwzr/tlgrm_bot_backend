import express  from 'express';
import {workersController} from '../controllers/WorkersController';
export let router = express.Router()

router.get('/workers', workersController.getAll);

router.get('/workers/:id', workersController.findById);

router.post('/workers', workersController.create);

router.put('/workers/:id', workersController.update);

router.delete('/workers/:id', workersController.delete);