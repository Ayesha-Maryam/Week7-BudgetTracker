const mongoose= require('mongoose');
const entrySchema =new mongoose.Schema({
    name:String,
    price: Number,
    date: Date,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BudgetUsers',
        req:true,
    }

})
const BudgetEntries=mongoose.model('BudgetEntries',entrySchema)
module.exports=BudgetEntries