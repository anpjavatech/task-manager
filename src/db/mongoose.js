import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL
mongoose.connect(MONGODB_URL)
  .then(() => console.log('Mongo DB is successfully connected!'));


  export default mongoose