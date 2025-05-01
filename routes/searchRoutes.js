import { Router } from 'express';
import { authcheck } from '../middleware/authware.js';
import { roles } from '../middleware/rolesware.js';
import { getMeds, getMedsFromId } from '../controllers/medicieneSearch.js';

const router = Router();

// Route to search medicines (from DB or OpenFDA)
router.get('/', getMeds);

// Route to get medicine details by ID (from DB or OpenFDA)
router.get('/:id', getMedsFromId);

export default router;