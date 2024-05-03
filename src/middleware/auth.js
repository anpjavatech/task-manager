import jwt from 'jsonwebtoken'
import User from '../models/users.js'

const JWT_SECRET = process.env.JWT_SECRET

async function auth(req, res, next){

    try{

        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedData = jwt.verify(token, JWT_SECRET)
        const user = await User.findOne({_id:decodedData._id, 'tokens.token':token})

        if(!user){
            throw new Error('Please Login.')
        }
        req.token = token
        req.user = user
        next()
    }catch(err){
        res.status(401).send({error: 'Please authenticate.'})
    }
}

export default auth