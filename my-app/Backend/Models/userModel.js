const mongoose= require ('mongoose')
const budgetUserSchema= new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    budgetLimit:Number,
})
const BudgetUsers = mongoose.model('BudgetUsers', budgetUserSchema)
console.log("Schema made Successfully.")
module.exports=BudgetUsers;