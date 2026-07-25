import express from "express"
import { addTasks, deleteTaskById, displayAllTasks, getTasksById, updateTasksById } from "../controllers/tasksController.js"
import authenticateUser from "../middleware/authMiddleware.js"
const router=express.Router()

router.post('/',authenticateUser,addTasks)
router.get('/',authenticateUser,displayAllTasks)
router.get('/:id',authenticateUser,getTasksById)
router.patch("/:id",authenticateUser,updateTasksById)
router.delete("/:id",authenticateUser,deleteTaskById)

export default router