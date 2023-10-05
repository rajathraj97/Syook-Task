const mongoose = require('mongoose')
require('dotenv').config()


const configureDB = async() =>{
    try{
        await mongoose.connect("mongodb://0.0.0.0:27017/timeseriesdb", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          console.log('connected to db')
    }
    catch(e){
        console.log(e)
    }
}

module.exports =  configureDB