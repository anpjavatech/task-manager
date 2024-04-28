import express from 'express'
import mongoose from '../db/mongoose.js'
import User from '../models/users.js'
import bcrypt from 'bcryptjs'
import auth from '../middleware/auth.js'

const router = express.Router()

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
        const token = await user.generateAuthToken()
        res.send({insertedUser, token})
    }catch(error){
        res.status(400).send(error.message)
    }
})

router.get('/users/me',auth, async (req, res)=>{
    res.send(req.user)
})

router.patch('/user/:id', async (req, res)=>{

    const _id = req.params.id
    const requestBody = req.body

    const updates = Object.keys(req.body)
    const allowedupdates = ['name', 'password']
    const isUpdateValid = updates.every((update)=> allowedupdates.includes(update))

    if(!isUpdateValid){
        return res.status(400).send({error:'Invalid Updates.'})
    }

    try{
        const user = await User.findById(_id)
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

router.delete('/user/:id', async (req, res)=>{

    const _id = req.params.id
    try{
        const deletedResponse = await User.deleteOne({_id})
        if(deletedResponse.deletedCount != 1){
            return res.status(404).send()
        }
        res.send('User deleted.')
    }catch(err){
        res.status(400).send(err.message)
    }

})

export default router