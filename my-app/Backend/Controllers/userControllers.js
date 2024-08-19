const express= require('express')
const BudgetUsers = require('../Models/userModel');

async function createUser(req, res)
{
    try
    {
        let newUser= new BudgetUsers({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            budgetLimit: req.body.budgetLimit,
            entries: req.body.entries
        })
        newUser= await newUser.save();
        res.send(newUser);

    }
    catch(error)
    {
        console.error('Error saving User:', error);
        res.status(500).send('Error saving User');
    }
}

async function getUser(req, res)
{
    try
    {
        const users= await BudgetUsers.find();
        res.send(users)
    }
    catch(error)
    {
        return res.status(404).send("Users not Found!")
    }
}

async function getUserbyId(req, res)
{
    try
    {
        let user= await BudgetUsers.findById(req.params.id)
        if(!user)
        {
            return res.status(404).send("User not Found!")
        }
        res.send(user)
    
    }
    catch(error){
        console.log(error)
    }
}
async function updateUser(req, res){
try
{
    const user=await BudgetUsers.findByIdAndUpdate(req.params.id,
        {
            entries:req.body.entries
        }
    )
    if(!user)
    {
        return res.status(404).send("User not Found!")
    }
    const updatedUser=await BudgetUsers.findById(req.params.id)
    res.send(updatedUser)
}
catch(error)
{
    console.log(error)
}
}
async function deleteUser(req, res)
{
    try
    {
        const user=await BudgetUsers.findByIdAndDelete(req.params.id);
        if(!user)
            {
                return res.status(404).send('User not Found')
            }else
            {
                return res.status(204).send()
            }
    }
    catch(error){
        console.log(error)
    }
}

module.exports=
{
    createUser,
    getUser,
    getUserbyId,
    updateUser,
    deleteUser
};