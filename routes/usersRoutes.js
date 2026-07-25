import express from "express"
import { addUser, deleteUserById, currentUser, updateUserData } from "../controllers/usersController.js"
import authenticateUser from "../middleware/authMiddleware.js"
const router=express.Router()

router.post('/',addUser)
router.get('/me',authenticateUser,currentUser)
router.patch('/me',authenticateUser,updateUserData)
router.delete('/me',authenticateUser,deleteUserById)

export default router