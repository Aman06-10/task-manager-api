export function logoutUser(req, res) {
    try {
        res.status(200)
            .clearCookie("token", {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            })
            .json({ success: true, message: "Logged Out Successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Internal Server Error." })
    }
}