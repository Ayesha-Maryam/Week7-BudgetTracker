const express= require('express')
const mongoose=require('mongoose')

async function connectDb()
{
    mongoose.connect('mongodb://localhost:27017/BudgetDb',{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>
        {
            console.log("Connected to MongoDb")
        }
        ).catch(error=>console.error("Could not Connect to MongoDb"))
}

module.exports=connectDb