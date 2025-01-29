import express from 'express';
import auth from './routes/userLoginRoutes.js';
import { errorHandler } from './middleware/errorhandler.js';
import userRoutes from './routes/userRoutes.js'
import medicineRoutes from './routes/medicineRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';

const app = express();
import{run} from './config/moongose.js';

run();
app.use(express.json());
app.use('/auth',auth);
app.use('/user', userRoutes);
app.use("/medicine",medicineRoutes);
app.use('/request',requestRoutes);
app.use('/inventory',inventoryRoutes);
app.use(errorHandler);

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});



const PO = process.env.PORT ;
