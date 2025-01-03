import {asuncHandler} from 'express-async-handler';
import {jwt} from 'jsonwebtoken';

const authcheck = asuncHandler( async (req,res,next)=>{
    let tocken;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith('Bearer')){
        tocken = authHeader.split(' ')[1];
        jwt.verify(tocken,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                res.status(401).json({
                    message: 'Not Authorized'
                });
            }else{
                req.user = decoded;
                next();
            }
        });
    }
})