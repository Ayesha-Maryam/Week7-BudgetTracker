const express= require ('express')
const router= express.Router();
const userController= require('../Controllers/userControllers')

router.post ('/', userController.createUser)
router.get('/', userController.getUser)
router.get('/:id', userController.getUserbyId)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)
module.exports=router;