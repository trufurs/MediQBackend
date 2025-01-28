import {Router} from 'express';
const router = Router();
import roles from '../middleware/rolesware.js';
import {getMediciene, getMedicieneById, createMediciene, updateMediciene} from '../controllers/medicineController.js';

router.route("/").get(roles('admin', 'store-owner', 'customer'),getMediciene).post(roles('admin', 'store-owner'),createMediciene);
router.route("/:id").get(getMedicieneById).put(updateMediciene);
//router.route("/").delete(deleteMediciene);
export default router;