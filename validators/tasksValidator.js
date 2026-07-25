const allowed = ['title', 'description', 'status', 'priority', 'due_date']
const QUERY_FIELDS=['priority', 'status','sort', 'order', 'page', 'limit', 'search', 'id']
const STATUS = ['pending', 'in_progress', 'completed']
const PRIORITY = ['low', 'medium', 'high']
const SORT = ["status", "due_date", "priority", "created_at", "id"]
const ORDER=["desc", "asc"]

function validateCommonFields(data) {
    const errors = {}
    if ("title" in data) {
        if (data.title.length > 200) {
            errors["title"] = "title cannot exceed 200 characters"
        }
    }
    if ("status" in data) {
        if (!(STATUS.includes(data.status))) {
            errors["status"] = "status can only be pending,in_progress and completed"
        }
    }
    if ("priority" in data) {
        if (!(PRIORITY.includes(data.priority))) {
            errors["priority"] = "prio can only be low,medium and high"
        }
    }
    if ("id" in data) {
        const id = Number(data.id)
        if (Number.isNaN(id) || id <= 0) {
            errors["id"] = "id is invalid"
        }
    }
    if ("sort" in data) {
        if (!(SORT.includes(data.sort))) {
            errors["sort"] = "sorting can only be based on status,due_date,priority,created_at,id"
        }
    }
    if ("order" in data) {
        if (!(ORDER.includes(data.order))) {
            errors["order"] = "order can only be desc or asc"
        }
    }
    if ("page" in data) {
        const page = Number(data.page)
        if (!Number.isInteger(page) || page <= 0) {
            errors["page"] = "page value must be a positive integer"
        }
    }
    if ("limit" in data) {
        const limit = Number(data.limit)
        if (!Number.isInteger(limit) || limit > 100 || limit <= 0) {
            errors["limit"] = "limit value must be between 1-100"
        }
    }
    if ("due_date" in data) {
        const date = new Date(data.due_date)
        if (Number.isNaN(date.getTime())) {
            errors["due_date"] = "Invalid date";
        }
    }
    return errors
}
export function validateTaskData(data) {
    const keys = Object.keys(data)
    const errors = validateCommonFields(data)
    for (const element of keys) {
        if (!allowed.includes(element)) {
            errors[element] = `${element} field does not exists`
        }
        if (data[element] === null || (typeof (data[element]) === "string" && data[element].trim() === "")) {
            errors[element] = `${element} cannot be empty`
        }
    }
    if (!keys.includes("title")) {
        errors["title"] = `title is required`
    }
    if (Object.keys(errors).length>0) {
        return { valid: false, errors }
    }
    return { valid: true }
}


export function validateUpdateTaskData(data) {
    const keys = Object.keys(data)
    if (keys.length === 0) return { valid: false, errors:{body:"Atleast provide one field to update"}}
    const nullableFields = ["description", "due_date"];
    const errors = validateCommonFields(data)
    for (const element of keys) {
        if (!allowed.includes(element)) {
            errors[element] = `${element} field does not exists`
        }
        if (!(nullableFields.includes(element)) && (data[element] === null || (typeof (data[element]) === "string" && data[element].trim() === ""))) {
            errors[element] = `${element} cannot be empty`
        }
    }
    if (Object.keys(errors).length>0) {
        return { valid: false, errors }
    }
    return { valid: true }
}

export function validateTasksQuery(data) {
    const keys = Object.keys(data)
    const errors = validateCommonFields(data)
    for (const element of keys) {
        if (!QUERY_FIELDS.includes(element)) {
            errors[element] = `${element} field does not exists`
        }
        if (data[element] === null || (typeof (data[element]) === "string" && data[element].trim() === "")) {
            errors[element] = `${element} cannot be empty`
        }
    }
    if (Object.keys(errors).length>0) {
        return { valid: false, errors }
    }
    return { valid: true }
}