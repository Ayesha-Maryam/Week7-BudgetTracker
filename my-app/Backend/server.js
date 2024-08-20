const port=8080;
const express= require('express')
const UserRouter=require('./Routes/userRoutes')
const EntryRouter=require('./Routes/entryRoutes')
const connectDb=require('./Config/db')
const cors=require('cors');
const app=express();
app.use(express.json())
app.use(cors());
connectDb();
app.use('/budgetUser',UserRouter)
app.use('/budgetEntries',EntryRouter)

app.listen(port,()=>
{
    console.log(`Server listening on port ${port}`)
})
