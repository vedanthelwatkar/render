const express = require("express")
const cors = require("cors")
const {MongoClient} = require("mongodb")
const nodemailer = require("nodemailer")

const app = express()
app.use(cors())
app.use(express.json())

const url = "mongodb+srv://vedanthelwatkar:vedd2201@cluster0.rjutssu.mongodb.net/"
const client = new MongoClient(url)

app.get("/entries", (req, res) => {
  const db = client.db("visitorms");
  const coll = db.collection("visitor");
  
  coll.find({}).toArray()
    .then(result => {
      res.json(result); // Send JSON response
    })
    .catch(err => {
      console.error("Error retrieving data:", err);
      res.status(500).json({ error: "An error occurred while fetching data." });
    });
});

app.post("/del", async (req, res) => {
  const db = client.db("visitorms");
  const coll = db.collection("visitor");
  const data = {
    phone: req.body.phone,
  };

  console.log("Received request to delete entry for phone:", data.phone);

  try {
    const exists = await coll.findOne(data);
    console.log("Entry exists:", exists);

    if (exists) {
      const deletionResult = await coll.deleteOne(data);
      console.log("Deletion Result:", deletionResult);

      if (deletionResult.deletedCount === 1) {
        res.status(200).send("ENTRY DELETED");
      } else {
        res.status(500).send("Error deleting entry");
      }
    } else {
      res.status(500).send("No entry found");
    }
  } catch (err) {
    console.error("Error deleting entry", err);
    res.status(500).send("Error deleting entry: " + err.message);
  }
});



app.post("/check",async(req,res)=>{
  const db = client.db("visitorms");
  const coll = db.collection("admin")
  const data = {
    user : req.body.user,
    pass : req.body.pass
  }
  try{
    const exists = await coll.findOne(data)
    if (exists){
      res.status(200).send("LOGGED IN")
    }
    else{
      res.status(400).send("NO USER FOUND")
    }
  }
  catch (err){
    console.error("Error Logging in", err);
    res.status(500).send(err.message);
  }
})

app.post("/create",async(req,res)=>{
  const db = client.db("visitorms");
  const coll = db.collection("admin")
  const data = {
    user : req.body.user,
    pass : req.body.pass
  }
  try {
    const result = await coll.insertOne(data);
    if (result.insertedId) {
      res.status(200).send("ACCOUNT CREATED");
    } else {
      res.status(400).send("INVALID INPUT");
    }
  } catch (err) {
    console.error("Error creating account", err);
    res.status(500).send("Error creating account: " + err.message);
  }  
})

app.post("/home", async (req, res) => {
  const db = client.db("visitorms");
  const coll = db.collection("visitor");
  const data = {
    name: req.body.name,
    phone: req.body.phone,
    time: req.body.time,
    date: req.body.date,
    visitee : req.body.visitee,
    office: req.body.office,
  };

  try {
    const existingdoc = await coll.findOne({$or:[{name:data.name},{phone:data.phone}]})
    if (existingdoc){
      res.status(400).send("Duplicate Entry")
    } else {
      const result = await coll.insertOne(data);
      console.log("Inserted document with _id:", result.insertedId);
      res.send("OK");
    }

  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).send(err.message);
  }
});

function sendEmail(name, txt, userEmail) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'vedantph22@gmail.com', // Your Gmail email address
      pass: 'mahfpsfrnypawyjl', // Your Gmail password
    },
  });

  let mailOptions = {
    from: 'vedantph22@gmail.com',
    to: 'vedanthelwatkar@gmail.com', // Use the user's email obtained from the request body
    subject: 'Request for OTP',
    text: txt,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
    } else {
    }
  });
}

app.post('/otp', (req, res) => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  const userEmail = req.body.user; // Assuming the user's email is sent in the request body

  // Send the OTP to the user's email
  sendEmail('Your App', `OTP: ${otp}`, `Request from ${userEmail}`);

  // You can also send the OTP in the response if needed
  res.status(200).json({ otp });
});

app.listen(8888,()=>("server live @ 8888"))
