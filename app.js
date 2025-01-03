import express from 'express';
import router from './routes/userLoginRoutes.js';

const app = express();
import{run} from './config/moongose.js';

run();
app.use(express.json());
//app.use('/medications', (await import('./routes/medicieneRoutes.js')).default);
app.use('/auth',router);
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});



const PO = process.env.PORT ;
