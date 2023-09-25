const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

function calculateEMI(principal, rate, tenure) {
    const monthlyRate = (rate / 12) / 100;
    const months = tenure * 12;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  }

app.post("/find",(req,res)=>{
    let amount = req.body.amount
    let tenure = req.body.tenure
    let rate = req.body.rate
    const emi = calculateEMI(amount, rate, tenure);
    const totalInterestPayable = emi * tenure * 12 - amount;
    const totalPayment = emi * tenure * 12;
    const result = {
        emi: emi.toFixed(2),
        totalInterestPayable: totalInterestPayable.toFixed(2),
        totalPayment: totalPayment.toFixed(2)
      };

    res.send(result);
  
    
  console.log("EMI calculated and sent");
})

app.listen(8080,()=>{console.log("Server is ready @ 8080")})