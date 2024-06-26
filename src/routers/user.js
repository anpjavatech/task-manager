import express from 'express'
import mongoose from '../db/mongoose.js'
import User from '../models/users.js'
import bcrypt from 'bcryptjs'
import auth from '../middleware/auth.js'
import multer from 'multer'
import sharp from 'sharp'
import sendWelcomeEmail, { sendCancellationEmail } from '../email/account.js'

const router = express.Router()
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter: (req, file, cb)=>{
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image.'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{

    req.user.avatar = await sharp(req.file.buffer).resize({width:300, height:300}).png().toBuffer()
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{ // to handle the error to return in json format
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar', auth, async (req, res)=>{

    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res)=>{

    try{
        const _id = req.params.id
        const user = await User.findById({_id})
        const avatar = user.avatar
        if(avatar === undefined){
            throw new Error('No avatar existing.')
        }
    
        res.set('Content-Type', 'image/jpg')
        res.send(avatar)
    }catch(err){
        res.status(400).send(err.message)
    }
    
})

router.post('/users/login', async (req, res)=>{
    const reqBody = req.body
    try{
        
        const user = await User.findByCredentials(reqBody.email, reqBody.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(err){
        res.status(400).send(err.message)
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    
    try{
        req.user.tokens = req.user.tokens.filter((token)=> req.token !== token.token)
        await req.user.save()
        res.send()
    }catch(err){
        res.status(500).send(err.message)
    }
})

router.post('/users/logoutAll', auth, async (req, res)=>{
    
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(err){
        res.status(500).send(err.message)
    }
})

router.post('/users', async (req, res)=>{
    const requestBody = req.body
    const user = new User(requestBody)

    try{
        const insertedUser = await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.send({insertedUser, token})
    }catch(error){
        res.status(400).send(error.message)
    }
})

router.get('/users/me',auth, async (req, res)=>{
    res.send(req.user)
})

router.patch('/user/me', auth, async (req, res)=>{

    const _id = req.user._id
    const requestBody = req.body

    const updates = Object.keys(req.body)
    const allowedupdates = ['name', 'password']
    const isUpdateValid = updates.every((update)=> allowedupdates.includes(update))

    if(!isUpdateValid){
        return res.status(400).send({error:'Invalid Updates.'})
    }

    try{
        const user = req.user
        updates.forEach((update)=> user[update] = requestBody[update])
        await user.save()

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }catch(err){
        res.status(400).send(err.message)
    }
})

router.delete('/user/me', auth, async (req, res)=>{

    try{
        const user = req.user
        await user.deleteOne()
        sendCancellationEmail(user.email, user.name)
        res.send(req.user)
    }catch(err){
        res.status(400).send(err.message)
    }

})

export default router