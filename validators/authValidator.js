const {z} = require("zod");


const createUserSchema = z.object({
    name : z.string().min(1, "Name is required"),
    email : z.email("Email is required"),
    password : z.string().min(12, "Password is required"),
    role : z.enum(["staff", "admin"]).optional(),
    total_leads : z.number().optional(),
    current_leads : z.number().optional(),
    successful_leads : z.number().optional(),
    unsuccessful_leads : z.number().optional(),
})

const loginUserSchema = z.object({
    email : z.email("Email is required"),
    password: z.string().min(12, "Password is required")
})


module.exports = {
    createUserSchema,
    loginUserSchema
}