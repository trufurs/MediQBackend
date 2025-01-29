import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

export const authcheck = asyncHandler( async (req,res,next)=>{
    let tocken;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith('Bearer')){
        tocken = authHeader.split(' ')[1];
        jwt.verify(tocken,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                throw new Error('JsonWebTokenError')
            }else{
                req.user = decoded;
                next();
            }
        });
    }
})