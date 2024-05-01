import express from 'express'
import mongoose from '../db/mongoose.js'
import Tasks from '../models/tasks.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/tasks', auth, async (req, res)=>{
    const requestBody = req.body
    const task = new Tasks({...requestBody, owner: req.user._id})

    try{
        const insertedTask = await task.save()
        res.send(insertedTask)
    }catch(err){
        res.status(400).send(err.message)
    }
})

router.get('/tasks', auth, async (req, res)=>{

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed=req.query.
        completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]==='desc'?-1:1
    }

    try{
        const completed = req.query.completed === 'true'
        await req.user.populate({
            path:'tasks', 
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }})
        res.send(req.user.tasks)
    }catch(err){
        res.status(500).send(err.message)
    }
    
})

router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id

    try{
        const task = await Tasks.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(400).send({message:'Task not found.', task:{}})
        }
        res.send({message:'Task found', task})
    }catch(err){
        res.status(500).send(err.message)
    }

})

router.patch('/task/:id', auth, async (req, res)=>{

    const _id = req.params.id
    const requestBody = req.body

    const updates = Object.keys(req.body)
    const allowedupdates = ['completed']
    const isUpdateValid = updates.every((update)=> allowedupdates.includes(update))

    if(!isUpdateValid){
        return res.status(400).send({error:'Invalid Updates.'})
    }

    try{

        const task = await Tasks.findOne({_id, owner:req.user._id})

        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update)=>task[update] = requestBody[update])
        task.save()
        res.send(task)
    }catch(err){
        res.status(400).send(err.message)
    }
})

router.delete('/task/:id', auth, async (req, res)=>{

    const _id = req.params.id
    try{
        const task = await Tasks.findOneAndDelete({_id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send('Task deleted.')
    }catch(err){
        res.status(400).send(err.message)
    }

})

export default router