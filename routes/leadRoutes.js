
const leadRouter = require("express").Router();

const { protectMiddleware } = require("../middlewares/authMiddleware");
const { adminVerifyHandler, validate, validateParams } = require("../middlewares/leadMiddleware");
const { 
    createLeadSchema,
    createNoteSchema,
    getByIdSchema
 } = require("../validators/leadValidator");



const {

    getAllLeads,
    getLeadById,
    createLead,
    updateLeadById,
    deleteLeadById,
    createNotesForLead,
    getAllNotesForLead,
    getDashboardStats,
    updateStatusById,
    getAllStaff,
    assignStaff,
    currentLeadUpdate,
    successLeadUpdate,
    failureLeadUpdate,
    totalLeadUpdate
    
} = require("../controllers/leadControllers");

leadRouter.get("/leads", protectMiddleware, getAllLeads);
leadRouter.get("/leads/:id", protectMiddleware, validateParams(getByIdSchema), getLeadById);
leadRouter.post("/leads", protectMiddleware, validate(createLeadSchema), createLead);
leadRouter.put("/leads/:id", protectMiddleware, validateParams(getByIdSchema), updateLeadById);
leadRouter.delete("/leads/:id", protectMiddleware, validateParams(getByIdSchema), deleteLeadById);
leadRouter.post("/leads/:id/notes", protectMiddleware, validateParams(getByIdSchema), validate(createNoteSchema), createNotesForLead);
leadRouter.get("/leads/:id/notes", protectMiddleware, validateParams(getByIdSchema), getAllNotesForLead);
leadRouter.get("/dashboard/stats", protectMiddleware, adminVerifyHandler, getDashboardStats);
leadRouter.put("/leads/:id/status", protectMiddleware,validateParams(getByIdSchema), updateStatusById);
leadRouter.get("/staff", protectMiddleware, getAllStaff);
leadRouter.put("/staff/assign/:leadId/:staffId", protectMiddleware, assignStaff);
leadRouter.put("/currentLeadUpdate/:staffId/:value", protectMiddleware, adminVerifyHandler, currentLeadUpdate);
leadRouter.put("/successLeadUpdate/:staffId/:value", protectMiddleware, adminVerifyHandler, successLeadUpdate);
leadRouter.put("/failureLeadUpdate/:staffId/:value", protectMiddleware, adminVerifyHandler, failureLeadUpdate);
leadRouter.put("/totalLeadUpdate/:staffId/:value", protectMiddleware, adminVerifyHandler, totalLeadUpdate);



module.exports = leadRouter;