export const roles = (...availableroles)=>{(req,res,next)=>{
    if(!availableroles.includes(req.user.role)){
        res.status(403).json({
            message: 'Not Authorized'
        });
        throw new Error('Not Authorized');
    }else{
        next();
    }
}
};