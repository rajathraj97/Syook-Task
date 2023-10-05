const express = require('express')
const cors = require('cors')
const TimeSeriesModel = require('./Models/TimeSeriesModel')
const configureDB = require('./DB/DB')

configureDB()
const app = express()
app.use(cors())
app.use(express.json())
const port = 3005

app.get("/data",async(req,res)=>{
    try{
        const data = await TimeSeriesModel.find({})
        res.json(data)
    }catch(e){
        res.json(e)
    }
})


app.listen(port,()=>{
    console.log("listening on port",port)
})

