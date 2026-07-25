import jwt from "jsonwebtoken"

export function generateToken(data) {
   return jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

export function verifyToken(token) {
   return jwt.verify(token, process.env.JWT_SECRET)
}

