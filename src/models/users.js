import mongoose from "mongoose"  
import validator from 'validator';

  //create schema
  const UserSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        validate(value){
            
        }
    },
    password:{
        type:String,
        required:true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password as password is not allowed..')
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email not valid.')
            }
        }
    }
  })

  const User = mongoose.model('users', UserSchema)

  export default User