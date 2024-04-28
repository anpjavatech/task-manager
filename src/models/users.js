import mongoose from "mongoose"  
import validator from 'validator';
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"

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
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email not valid.')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
  })

  UserSchema.methods.toJSON = function (){
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
  }

  UserSchema.methods.generateAuthToken = async function (){

    const token = jwt.sign({_id:this._id}, "thisismyfirstjwttokengenertion", {expiresIn:'1h'})
    this.tokens = this.tokens.concat({token})
    await this.save()

    return token

  }

  UserSchema.statics.findByCredentials = async function (email, password){

    const user = await User.findOne({email})
    if(!user){
        throw new Error('User not found, Plese signup.')
    }

    const isUserValid = await bcryptjs.compare(password, user.password)
    if(!isUserValid){
        throw new Error('Wrong credentials.')
    }

    return user
  }

  UserSchema.pre('save', async function (next){
    if(this.isModified('password')){
        this.password = await bcryptjs.hash(this.password, 8)
    }

    next()
  })

  const User = mongoose.model('users', UserSchema)

  export default User