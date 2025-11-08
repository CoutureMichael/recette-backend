import { Router } from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { getAll, getOne, createOne, updateOne, removeOne } from '../controllers/recipeController.js';


const router = Router();
router.use(auth);
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', createOne);
router.put('/:id', updateOne);
router.delete('/:id', removeOne);

export default router;