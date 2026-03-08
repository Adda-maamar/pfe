const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  role: {
    type: String,
    default: "user"
  }
}, { timestamps: true });


// تشفير كلمة المرور قبل الحفظ
UserSchema.pre('save',async function(){
  const salt = await bcrypt.genSalt(10)
  const hashPass= await bcrypt.hash(this.password,salt)
  this.password = hashPass;
})
UserSchema.methods.createToken=function(){
  if (!process.env.JWT_SCRT) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
  }
  return (
    jwt.sign({userId:this._id,name:this.name,email:this.email,role:this.role},process.env.JWT_SCRT, { expiresIn: '30d' })
  )
}
UserSchema.methods.comparePassword=async function(password){
const isMatched=await bcrypt.compare(password,this.password)
return isMatched
}
module.exports=mongoose.model('User',UserSchema)
// مقارنة كلمة المرور
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);