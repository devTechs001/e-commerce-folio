import express from 'express';
import {
  createPortfolio,
  getPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio
} from '../controllers/portfolioController.js';

const router = express.Router();

router.post('/', createPortfolio);
router.get('/', getPortfolios);
router.get('/:id', getPortfolioById);
router.put('/:id', updatePortfolio);
router.delete('/:id', deletePortfolio);

export default router;
