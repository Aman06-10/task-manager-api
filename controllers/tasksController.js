import pool from "../databases/db.js"
import { validateTaskData, validateTasksQuery, validateUpdateTaskData } from "../validators/tasksValidator.js"

export async function addTasks(req, res) {
    try {
        const { valid, errors } = validateTaskData(req.body)
        if (!valid) {
            return res.status(400).json({ success: false, errors })
        }
        const keys = [...Object.keys(req.body),"user_id"]
        const values = [...Object.values(req.body),req.user.id]
        const para = values.map((_, index) => `$${index + 1}`)
        const result = await pool.query(`INSERT INTO tasks (${keys.join(', ')}) VALUES(${para.join(", ")}) RETURNING id,title,status,priority,user_id`, [...values])
        if (result.rows.length > 0) {
            return res.status(201).json({ success: true, data: result.rows[0] })
        }
    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({ success: false, message: "User with given id does not exist" })
        }
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error. " })
    }
}

export async function displayAllTasks(req, res) {
    try {
        const { sort, order, page, limit, search, ...filters } = req.query
        const user_id = req.user.id;
        const keys = [...Object.keys(filters),"user_id"]
        const values = [...Object.values(filters),user_id]
        const { valid, errors } = validateTasksQuery(req.query)
        if (!valid) {
            return res.status(400).json({ success: false, errors })
        }
        const conditions = keys.map(
            (key, index) => `${key}=$${index + 1}`
        )
        let sql = `SELECT id,title,description,status,priority,due_date,user_id,created_at,updated_at FROM tasks`
        if (search) {
            conditions.push(`title ILIKE $${values.length + 1}`);
            values.push(`%${search}%`);
        }
        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" AND ")}`
        }
        const sortField = sort || "created_at"
        const sortOrder = (order || "DESC").toUpperCase()
        sql += ` ORDER BY ${sortField} ${sortOrder}`
        const Page = Number(page) || 1
        const Limit = Number(limit) || 10
        const offset = (Page - 1) * Limit
        sql += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
        const result = await pool.query(sql, [...values, Limit, offset])
        return res.status(200).json({ success: true, page: Page, limit: Limit, count: result.rows.length, data: result.rows })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export async function getTasksById(req, res) {
    try {
        const task_id = Number(req.params.id)
        const user_id=req.user.id
        if (Number.isNaN(task_id) || task_id <= 0) {
            return res.status(400).json({ success: false, message: "Id is invalid" })
        }
        const result = await pool.query("SELECT * FROM tasks WHERE id=$1 AND user_id=$2", [task_id,user_id])
        if (result.rows.length > 0) {
            return res.status(200).json({ success: true, data: result.rows[0] })
        }
        return res.status(404).json({ success: false, message: "No tasks found with given id" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function updateTasksById(req, res) {
    try {
        const task_id = Number(req.params.id)
        const user_id=req.user.id
        if (Number.isNaN(task_id) || task_id <= 0) {
            return res.status(400).json({ success: false, message: "task id is invalid" })
        }
        const { valid, errors } = validateUpdateTaskData(req.body)
        if (!(valid)) {
            return res.status(400).json({ status: false, errors })
        }
        const keys = Object.keys(req.body)
        const values = Object.values(req.body)
        const updateData = keys.map((key, index) => `${key}=$${index + 1}`)
        const result = await pool.query(`UPDATE tasks SET ${updateData.join(", ")} WHERE id=$${values.length + 1} AND user_id=$${values.length+2} RETURNING *`, [...values, task_id, user_id])
        if (result.rows.length > 0) {
            return res.status(200).json({ success: true, data: result.rows[0] })
        }
        return res.status(404).json({ success: false, message: "No tasks found with given id" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function deleteTaskById(req, res) {
    try {
        const task_id = Number(req.params.id)
        const user_id=req.user.id
        if (Number.isNaN(task_id) || task_id <= 0) {
            return res.status(400).json({ success: false, message: "task id is invalid" })
        }
        const result = await pool.query("DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *", [task_id,user_id])
        if (result.rows.length > 0) {
            return res.status(200).json({ success: true, data: result.rows[0] })
        }
        return res.status(404).json({ success: false, message: "No tasks found with given task id" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}
