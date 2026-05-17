const { z } = require("zod");

const createLeadSchema = z.object({
    name : z.string().min(1, "Name is required"),
    status : z.enum(["not_contacted", "contacted", "follow_up_needed", "success", "failure"]).optional(),
    contact : z.string().min(8, "Contact details is required"),
    notes : z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").optional(),
    staff : z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId").optional()
})


const createNoteSchema = z.object({
    title : z.string().min(1, "Title is required"),
    content : z.string().min(1, "Content is required")
})

const getByIdSchema = z.object({
    id : z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
})


module.exports = {
    createLeadSchema,
    createNoteSchema,
    getByIdSchema
}