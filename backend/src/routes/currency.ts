import express from 'express';
import { SuccessResponse } from '../types/types';
const currencies = require('../utils/currencies.json');

const router = express.Router();

router.get('/', async (req, res) => {
  res.status(200).json(
    new SuccessResponse('Currencies retrieved', {
      currencies,
    })
  );
});

export default router;
