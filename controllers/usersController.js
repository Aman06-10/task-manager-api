import pool from "../databases/db.js"
import bcrypt from "bcrypt"
import { validateDataUser, validateUpdateData } from "../validators/usersValidator.js"
import { generateToken } from "../utils/jwt.js"

export async function addUser(req, res) {
    try {
        const { valid, errors } = validateDataUser(req.body)
        if (!valid) {
            return res.status(400).json({ success: false, errors })
        }
        const { name, email, password } = req.body
        const hashed_password = await bcrypt.hash(password, 10)
        const result = await pool.query(" INSERT INTO users (name,email,password) VALUES($1,$2,$3) RETURNING id,name,email", [name, email, hashed_password])
        const JwtKey = generateToken(result.rows[0])
        return res.status(201)
            .cookie("token", JwtKey, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .json({ success: true, data: result.rows[0] })
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ success: false, message: "Email already exists." })
        }
        console.log(error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function currentUser(req, res) {
    try {
        const id = req.user.id
        const result = await pool.query("SELECT id ,name , email FROM users WHERE id=$1", [id])
        return res.status(200).json({ success: true, data: result.rows[0] })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export async function updateUserData(req, res) {
    try {
        const id = req.user.id
        const { valid, errors } = validateUpdateData(req.body)
        if (!valid) {
            return res.status(400).json({ success: false, errors })
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10)
        }
        const keys = Object.keys(req.body)
        const values = Object.values(req.body)
        const data = keys.map((key, index) => `${key}=$${index + 1}`)
        const result = await pool.query(`UPDATE users SET ${data.join(", ")} WHERE id=$${values.length + 1} RETURNING id, name, email`, [...values, id])
        if (result.rows.length > 0) {
            return res.status(200).json({ success: true, data: result.rows[0] })
        }
        return res.status(404).json({ success: false, message: "User not found." })
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ success: false, message: "Email already exists." })
        }
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

export async function deleteUserById(req, res) {
    try {
        const id = req.user.id
        const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING id, name, email", [id])
        if (result.rows.length > 0) {
            return res.status(200)
                .clearCookie("token", {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax"
                })
                .json({ success: true, data: result.rows[0] })
        }
        return res.status(404).json({ success: false, message: "No user found with the given ID." })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error." })
    }
}
