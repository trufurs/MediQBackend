import express from 'express';
import { authcheck } from '../middleware/authware.js';
import { roles } from '../middleware/rolesware.js';

const router = express.Router();



export default router;