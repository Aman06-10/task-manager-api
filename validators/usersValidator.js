const allowed = ["name", "email", "password"]

function validateFields(currentData) {
    const keys = Object.keys(currentData)
    const errors = {}
    for (const element of keys) {
        if (!allowed.includes(element)) {
            errors[element] = `${element} field does not exist`
        }
        if (currentData[element] === null || (typeof currentData[element] === "string" && currentData[element].trim() === "")) {
            errors[element] = `${element} cannot be empty`
        }
    }
    if ("name" in currentData) {
        if (currentData.name.length > 100) {
            errors.name = "Name cannot exceed 100 characters.";
        }
    }
    if ("password" in currentData) {
        if (currentData.password.length < 8) {
            errors.password = "Password must be at least 8 characters.";
        }
    }
    if ("email" in currentData) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(currentData.email)) {
            errors["email"] = "Invalid email."
        }
    }
    return errors
}

export function validateDataUser(currentData) {
    const keys = Object.keys(currentData)
    const errors = validateFields(currentData)
    for (const element of allowed) {
        if (!keys.includes(element)) {
            errors[element] = `${element} field is required`
        }
    }
    if (Object.keys(errors).length > 0) {
        return { valid: false, errors: errors }
    }
    return { valid: true }
}

export function validateUpdateData(currentData) {
    const keys = Object.keys(currentData)
    if (keys.length === 0) {
        return {
            valid: false, errors: {
                body: "Atleast one field should be provided."
            }
        }
    }
    const errors = validateFields(currentData)
    if (Object.keys(errors).length > 0) {
        return { valid: false, errors: errors }
    }
    return { valid: true }
}