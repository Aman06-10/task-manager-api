export function validateLoginData(data) {
    const allowed = ['password', 'email']
    const keys = Object.keys(data)
    const errors = {}
    for (const element of allowed) {
        if (!keys.includes(element)) {
            errors[element] = `${element} field is required`
        }
    }
    for (const element of keys) {
        if (!allowed.includes(element)) {
            errors[element] = `${element} field does not exist`
        }
        if (data[element] === null || (typeof data[element] === "string" && data[element].trim() === "")) {
            errors[element] = `${element} cannot be empty`
        }
    }
    if ("email" in data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email)) {
            errors["email"] = "Invalid email."
        }
    }
    if (Object.keys(errors).length > 0) {
        return { valid: false, errors }
    }
    return { valid: true }
}