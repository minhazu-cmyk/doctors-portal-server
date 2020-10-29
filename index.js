const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dhmoa.mongodb.net/${process.env.DB_PASS}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('doctors'));
app.use(fileUpload());
const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointment");
  

  app.post("/addAppointment", (req,res)=>{
    const appointment =req.body;
    appointmentCollection.insertOne(appointment)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  });

  app.post("/addAppointmentByDate", (req,res)=>{
    const date =req.body;
    console.log(date.date);
    appointmentCollection.find({date: date.date})
   .toArray((err,documents)=>{
     res.send(documents)
   })
    })

app.post("/addDoctor", (req,res)=>{
  const name = req.body.name;
  const email = req.body.email;
  console.log(name,email)
})

app.get('/appointments', (req, res) => {
  appointmentCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
})


});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT||port)