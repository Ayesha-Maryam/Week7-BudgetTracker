const entryController=require('../Controllers/entryController')
const express=require('express')
const router=express.Router();

router.post('/',entryController.createEntry)
router.get('/:id',entryController.getEntryByUserId)
router.put('/:id',entryController.updateEntry)
router.delete('/:id',entryController.deleteEntry)

module.exports=router;