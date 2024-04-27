import express from 'express'
import mongoose from './db/mongoose.js'
import User from './models/users.js'


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



app.listen(port, ()=>{
    console.log(`Server is up and running in port : ${port}`)
})