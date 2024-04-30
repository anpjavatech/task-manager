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

    try{
        //const tasks = await Tasks.find({owner:req.user._id}) Also a valid way to fetch the data.
        await req.user.populate('tasks')
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

//This api is used to demonstrate the chaining of Promise
router.post('/removeAndFetchNoOfIncompleteTasks/:id', async (req, res)=>{

    const _id =  req.params.id
    try{
        const removeResponse = await Tasks.deleteOne({id})
        const count = await Tasks.countDocuments({completed:false})
        res.send({message:'No: of tasks', count})
    }catch(err){
        res.status(500).send(err.message)
    }
})

router.patch('/task/:id', async (req, res)=>{

    const _id = req.params.id
    const requestBody = req.body

    const updates = Object.keys(req.body)
    const allowedupdates = ['completed']
    const isUpdateValid = updates.every((update)=> allowedupdates.includes(update))

    if(!isUpdateValid){
        return res.status(400).send({error:'Invalid Updates.'})
    }

    try{
        const task = await Tasks.findById(_id)
        updates.forEach((update)=>task[update] = requestBody[update])
        task.save()

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(err){
        res.status(400).send(err.message)
    }
})

router.delete('/task/:id', async (req, res)=>{

    const _id = req.params.id
    try{
        const task = await Tasks.findByIdAndDelete({_id})
        if(!task){
            return res.status(404).send()
        }
        res.send('Task deleted.')
    }catch(err){
        res.status(400).send(err.message)
    }

})

export default router