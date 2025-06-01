import { Router } from 'express';
import { InstituteController } from './institute.controller';
import { authenticateUser } from '../../middleware/auth.middleware';

const router = Router();
const controller = new InstituteController();

// Public routes
router.get('/', controller.findAll.bind(controller));
router.get('/:id', controller.findById.bind(controller));

// Protected routes requiring authentication
router.post('/', authenticateUser, controller.create.bind(controller));
router.put('/:id', authenticateUser, controller.update.bind(controller));
router.delete('/:id', authenticateUser, controller.delete.bind(controller));
router.patch('/:id/deactivate', authenticateUser, controller.softDelete.bind(controller));

export default router;