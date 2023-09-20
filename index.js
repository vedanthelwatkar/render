const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

app.post("/minutes",(req,res)=>{
    let hr = req.body.hr
    console.log(hr)
    if (hr === "undefined" || isNaN(hr)){
        res.status(400).send("Invalid Input for Hours")
    } else {
        const result = hr * 60
        if(result !== "undefined"){
        res.send({result})
        console.log(result)
      } else{
        res.status(500).send("Error calculating Minutes")
     }
    }
})

app.post("/seconds",(req,res)=>{
    let hr = req.body.hr
    console.log(hr)
    if (hr === "undefined"){
        res.status(400).send("Invalid input for hours")
    } else {
        const result = hr * 3600
        if (result !=="undefined"){
            res.send({result})
            console.log(result)
        } else{
            res.status(500).send("Error calculating seconds")
        }
    }
})

app.post("/mili",(req,res)=>{
    let hr = req.body.hr
    if (hr==="undefined" || isNaN(hr)){
        res.status(400).send("Invalid input for hours")
    } else {
        const result = (hr * 3600)/0.001
        if( result !== "undefined"){
            res.send({result})
            console.log(result)
        } else {
            res.status(500).send("Error calculating milliseconds")
        }
    }
})

app.listen(8000,()=>{console.log("server ready @ 8000")})