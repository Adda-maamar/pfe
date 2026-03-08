
const jwt=require('jsonwebtoken')
const {StatusCodes}=require('http-status-codes')
 const auth=async(req,res,next)=>{

 if (!process.env.JWT_SECRET && !process.env.JWT_SCRT) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'JWT_SECRET is not defined' });
  }
  const authHeader = req.headers.authorization;
if(!authHeader){
    return res.status(StatusCodes.UNAUTHORIZED).json({error:"INVALID AUTHORISATION"})
}  
const token=authHeader.split(' ')[1].trim()
   
try {
  const payload = jwt.verify(token,process.env.JWT_SCRT)
 const user = await User.findById(payload.id);
req.user=user
  next()
} catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({error:error})
}

}
const itsAdmin=async(req,res,next)=>{
 auth(req,res,()=>{
  if(req.user.role==='admin'){
    next();
  }else{
    return res.status(StatusCodes.FORBIDDEN).json({error:'your not admin'})
  }

 })
}
module.exports= {auth,itsAdmin}