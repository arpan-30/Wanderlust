const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
});

// plugin is used as it will automatically genearte hash and salt username and hashed passsword

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);