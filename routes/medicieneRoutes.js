import {Router} from 'express';
const router = Router();
import {getMediciene, getMedicieneById, createMediciene, updateMediciene} from '../controllers/medicineController.js';

router.route("/").get(getMediciene).post(createMediciene);
router.route("/:id").get(getMedicieneById).put(updateMediciene);
//router.route("/").delete(deleteMediciene);
export default router;