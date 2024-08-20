const BudgetEntries=require('../Models/entriesModel')
const BudgetUsers=require('../Models/userModel')

async function createEntry(req, res)
{
    try{
        let newEntry= new BudgetEntries({
            name:req.body.name,
            price: req.body.price,
            date:req.body.date,
            user:req.body.userId
        })
        newEntry= await newEntry.save();
        const user=await BudgetUsers.findById(req.body.userId)
        res.send({user, newEntry})
    }
    catch(error)
    {
        console.log(error)
        return res.status(500).send("Error Saving Entry")
    }
}

async function getEntryByUserId(req, res)
{
    try
    {
        const entry= await BudgetEntries.find({user:req.params.id});
        if (!entry)
        {
            return res.status(404).send("Entry Not Found!")
        }
        res.send(entry)
    }
    catch(error)
    {
        console.log(error)
    }
    
}
async function updateEntry(req,res)
{
    try{
        const entry=await BudgetEntries.findByIdAndUpdate(req.params.id,
            {
                name:req.body.name,
                price:req.body.price,
                date:req.body.date,
            }
        )
        if(!entry){
            return res.status(404).send("Entry Not Found!")
        }
        const updatedEntry= await BudgetEntries.findById(req.params.id);
        res.send(updatedEntry)
            
    }
    catch(error)
    {
        console.log(error)
    }
}
async function deleteEntry(req,res)
{
    try{
        const entry=await BudgetEntries.findByIdAndDelete(req.params.id);
        if(!entry){
            return res.status(404).send("Entry Not Found!")
        }
        return res.status(204).send()
    }
    catch(error)
    {
        console.log(error)
    }
}

module.exports={
    createEntry,
    getEntryByUserId,
    updateEntry,
    deleteEntry,

}