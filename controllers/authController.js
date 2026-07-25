import { validateLoginData } from "../validators/authValidator.js";
import pool from "../databases/db.js"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/jwt.js";

export async function loginUser(req, res) {
    try {
        const { valid, errors } = validateLoginData(req.body)
        if (!valid) {
            return res.status(400).json({ success: false, errors })
        }
        const result = await pool.query("SELECT id,email,password FROM users WHERE email=$1", [req.body.email])
        if (result.rows.length > 0) {
            const user = result.rows[0]
            const isTrue = await bcrypt.compare(req.body.password, user.password)
            if (isTrue) {
                const JwtKey = generateToken(user)
                return res.status(200)
                    .cookie("token", JwtKey, {
                        httpOnly: true,
                        secure: false,
                        sameSite: "lax",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    })
                    .json({ status: true, message: "Login successfull" })
            }
        }
        return res.status(401).json({ success: false, message: "Invalid email or password" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}