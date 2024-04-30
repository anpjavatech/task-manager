import mongoose, { Model } from "mongoose";

const TaskSchema = mongoose.Schema({
    'description':{
        type:String,
        trim:true,
        required:true    
    },
    'completed':{
        type:Boolean,
        default:false
    },
    'owner':{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
})

const Tasks = mongoose.model('Tasks', TaskSchema)

export default Tasks