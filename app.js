import express from 'express';
import router from './routes/userLoginRoutes.js';
import { errorHandler } from './middleware/errorhandler.js';

const app = express();
import{run} from './config/moongose.js';

run();
app.use(express.json());
//app.use('/medications', (await import('./routes/medicieneRoutes.js')).default);
app.use('/auth',router);
app.use('/store', (await import('./routes/storeRoutes.js')).default);
app.use(errorHandler);

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});



const PO = process.env.PORT ;
