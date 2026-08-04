const mongoose  = require('mongoose');

const adminSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
    }
},
{tiemstamp:true}
)
const adminModel = mongoose.model("admin",adminSchema);


module.exports=adminModel;