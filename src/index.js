import express from 'express'
import mongoose from './db/mongoose.js'
import User from './models/users.js'
import Tasks from './models/tasks.js'

const app = express()
const port = process.env.PORT || 3001

//express json parser
app.use(express.json())

app.post('/users', async (req, res)=>{
    const requestBody = req.body
    const user = new User(requestBody)

    try{
        const insertedUser = await user.save()
        res.send(insertedUser)
    }catch(error){
        res.status(400).send(error.message)
    }
})

app.get('/users', async (req, res)=>{

    try{
        const users = await User.find({})
        res.send(users)
    }catch(err){
        res.status(500).send(err.message)
    }
    
})

app.get('/user/:id', async (req, res)=>{
    const _id = req.params.id

    try{
       const user = await  User.findById(_id)
       if(!user){
        return res.status(400).send({message:'User not found.', user:{}})
        }
        res.send({message:'User found', user})
    }catch(err){
        res.status(500).send(err.message)
    }

})

app.patch('/user/:id', async (req, res)=>{

    const _id = req.params.id
    const requestBody = req.body

    const updates = Object.keys(req.body)
    const allowedupdates = ['name', 'password']
    const isUpdateValid = updates.every((update)=> allowedupdates.includes(update))

    if(!isUpdateValid){
        return res.status(400).send({error:'Invalid Updates.'})
    }

    try{
        const user = await User.findByIdAndUpdate(_id, 
            requestBody, 
            {new:true, runValidators:true})

        if(!user){
            return res.status(404).send()
        }

        res.send(user)
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.delete('/user/:id', async (req, res)=>{

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

app.post('/tasks', async (req, res)=>{
    const requestBody = req.body
    const task = new Tasks(requestBody)

    try{
        const insertedTask = await task.save()
        res.send(insertedTask)
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.get('/tasks', async (req, res)=>{

    try{
        const tasks = await Tasks.find({})
        res.send(tasks)
    }catch(err){
        res.status(500).send(err.message)
    }
    
})

app.get('/tasks/:id', async (req, res)=>{
    const _id = req.params.id

    try{
        const task = await Tasks.findById(_id)
        if(!task){
            return res.status(400).send({message:'Task not found.', task:{}})
        }
        res.send({message:'Task found', task})
    }catch(err){
        res.status(500).send(err.message)
    }

})

//This api is used to demonstrate the chaining of Promise
app.post('/removeAndFetchNoOfIncompleteTasks/:id', async (req, res)=>{

    const _id =  req.params.id
    try{
        const removeResponse = await Tasks.deleteOne({id})
        const count = await Tasks.countDocuments({completed:false})
        res.send({message:'No: of tasks', count})
    }catch(err){
        res.status(500).send(err.message)
    }
})

app.patch('/task/:id', async (req, res)=>{

    const _id = req.params.id
    const requestBody = req.body

    const updates = Object.keys(req.body)
    const allowedupdates = ['completed']
    const isUpdateValid = updates.every((update)=> allowedupdates.includes(update))

    if(!isUpdateValid){
        return res.status(400).send({error:'Invalid Updates.'})
    }

    try{
        const task = await Tasks.findByIdAndUpdate(_id, 
            requestBody, 
            {new:true, runValidators:true})

        if(!task){
            return res.status(404).send()
        }

        res.send(task)
    }catch(err){
        res.status(400).send(err.message)
    }
})

app.delete('/task/:id', async (req, res)=>{

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


app.listen(port, ()=>{
    console.log(`Server is up and running in port : ${port}`)
})