import { Router } from 'express';
import { roles } from '../middleware/rolesware.js';
import { authcheck } from '../middleware/authware.js';
import { getAddressAuth, getAddress, createAddress, getAddresses , updateAddressAuth } from '../controllers/addressController.js';

const router = Router();

router.route('/')
    .get(authcheck, roles('admin'), getAddresses)
    .post(authcheck, roles('admin'), createAddress);

router.route('/auth')
    .get(authcheck, roles('store-owner'), getAddressAuth)
    .put(authcheck, roles('store-owner'), updateAddressAuth);

router.route('/filter')
    .get(authcheck, roles('store-owner'), getAddress);

export default router;