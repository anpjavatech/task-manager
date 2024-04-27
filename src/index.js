import express from 'express'
import mongoose from './db/mongoose.js'
import User from './models/users.js'
import Tasks from './models/tasks.js'


const app = express()
const port = process.env.PORT || 3001

//express json parser
app.use(express.json())

app.post('/users', (req, res)=>{
    const requestBody = req.body
    const user = new User(requestBody)

    user.save()
    .then((returnedData)=>{
        res.send(returnedData)
    })
    .catch((error)=>{
        res.status(400).send(error.message)
    })
})

app.get('/users', (req, res)=>{
    User.find({})
    .then((data)=>{
        res.send(data)
    }).catch((err) =>{
        res.status(500).send(err.message)
    })
    
})

app.get('/user/:id', (req, res)=>{
    const _id = req.params.id

    User.findById(_id)
    .then((user)=>{
        if(!user){
            return res.status(400).send({message:'User not found.', user:{}})
        }
        res.send({message:'User found', user})
    }).catch((err) =>{
        res.status(500).send(err.message)
    })

})

app.post('/tasks', (req, res)=>{
    const requestBody = req.body
    const task = new Tasks(requestBody)

    task.save()
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.status(400).send(err.message)
    })
})

app.get('/tasks', (req, res)=>{
    Tasks.find({})
    .then((tasks)=>{
        res.send(tasks)
    }).catch((err) =>{
        res.status(500).send(err.message)
    })
    
})

app.get('/tasks/:id', (req, res)=>{
    const _id = req.params.id

    Tasks.findById(_id)
    .then((task)=>{
        if(!task){
            return res.status(400).send({message:'Task not found.', task:{}})
        }
        res.send({message:'Task found', task})
    }).catch((err) =>{
        res.status(500).send(err.message)
    })

})



app.listen(port, ()=>{
    console.log(`Server is up and running in port : ${port}`)
})