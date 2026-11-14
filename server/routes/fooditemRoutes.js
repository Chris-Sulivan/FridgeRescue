
import express from 'express';
import * as controller from '../controllers/foodItemController.js';
import protect from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(protect);

router.route('/')
  .get(controller.getAll)
  .post(controller.create)
  .delete(controller.removeAll);

router.route('/:id')
  .get(controller.getById)
  .put(controller.update)
  .delete(controller.remove); 

export default router;