const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name:{
        type :String,
        require:true
    },
    role:{
        type:String,
        require:true
    },
    qualification:{
        type:String,
        require:true
    },
    experience:{
        type:String,
        require:true
    },
      email:{
        type:String,
        require:true
    },
      image:{
        type:String,
        require:true
    },
    section:{
        type:String,
        require:true
    }
    
})

const staffModel = mongoose.model('staff',staffSchema);


module.exports= staffModel;



