import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://anoopks007:HadGwNtJM7CfatzP@anpks.ocn2esk.mongodb.net/?retryWrites=true&w=majority&appName=Anpks")
  .then(() => console.log('Mongo DB is successfully connected!'));


  export default mongoose