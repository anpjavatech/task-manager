
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://anoopks007:HadGwNtJM7CfatzP@anpks.ocn2esk.mongodb.net/?retryWrites=true&w=majority&appName=Anpks";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const db = client.db("task-manager");

db.collection('test')
.insertOne({name:"Anoop", age:36})
.then((data)=>{
    console.log(data)
}).catch((error)=>{
    console.log(error)
})

const docs = [{name:"Manasa", age:33},
{name:"Ishaan", age:4}]

db.collection("test")
.insertMany(docs)
.then((insertedResponse)=>{
    console.log(insertedResponse)
}).catch((error)=>{
    console.log(error)
})