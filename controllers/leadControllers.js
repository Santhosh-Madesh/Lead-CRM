
const { getUserData, getAllStaffModel } = require("../models/authModels");
const {
    getAllLeadsModel,
    getLeadByIdModel,
    createLeadModel,
    updateLeadByIdModel,
    deleteLeadByIdModel,
    createNotesForLeadModel,
    getAllNotesForLeadModel,
    getDashboardStatsModel,
    updateStatusByIdModel,
    assignStaffModel,
    currentLeadUpdateModel,
    successLeadUpdateModel,
    failureLeadUpdateModel,
    totalLeadUpdateModel,
    getLeadCountModel
    
} = require("../models/leadModels");

const createError = require("http-errors");


const getAllLeads = async (req, res, next) => {

    try{

        const {status, search} = req.query;

        const sortBy = req.query.sort || "-createdAt";

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page-1)*limit;

        const filter = {};

        if(status){
            filter.status = status;
        }

        if(search){
            filter.$or = [
                { name : { $regex: search, $options:"i"}},
                { contact : { $regex: search, $options:"i"}},
            ];
        }

        const leads = await getAllLeadsModel(filter, sortBy, limit, skip);
        const total = await getLeadCountModel(filter);

        res.json({
            success: true,
            message : "Leads retrieved successfully!",
            page: page,
            limit: limit,
            total: total,
            totalPages: Math.ceil(total / limit),
            data : leads
        })
    } catch(error) {
        next(error);
    }
}

const getLeadById = async (req, res, next) => {
    try{

        const {id} = req.validatedParams;

        const lead = await getLeadByIdModel(id);

        if(!lead){
            return next(createError(404, "Data not found!"))
        }

        res.json({
            success: true,
            message : "Data retrieved by ID successfully",
            data : lead
        })


    } catch(error){
        next(error);
    }
}

const createLead = async (req, res, next) => {
    
    try {

        const { name, contact } = req.validatedData;

        const lead = await createLeadModel(name, contact);

        res.status(201).json({
            success:true,
            message : "Data created successfully",
            data : lead
        })

    } catch(error) {

        next(error);

    }
}


const updateLeadById = async (req, res, next) => {

    try {

        const { id } = req.validatedParams;

        const staffId = req.user.userId;

        const Lead = await getLeadByIdModel(id);

        const staff = await getUserData(staffId);

        const isAdmin = staff.role === "admin";

        if(!isAdmin){

            const isStaffAuthenticated = String(Lead.staff) === staffId;
            
            if(!isStaffAuthenticated){
                return next(createError(401, "You are not authenticated"));
            }

        }

        const {name, contact} = req.body;

        const lead = await updateLeadByIdModel(id, name, contact);

        res.json({
            success: true,
            message : "Data updated successfully!",
            data : lead
        })

    } catch( error ) {
        next(error);
    }
}


const deleteLeadById = async (req, res, next) =>{

    try{

        const { id } = req.validatedParams;

        const staffId = req.user.userId;

        const Lead = await getLeadByIdModel(id);

        const staff = await getUserData(staffId);


        

        const isAdmin = staff.role === "admin";

        if(!isAdmin){

            const isStaffAuthenticated = String(Lead.staff) === staffId;
            
            if(!isStaffAuthenticated){
                return next(createError(401, "You are not authenticated"));
            }

        }

        

        const lead = await deleteLeadByIdModel(id);

        res.json({
            success:true,
            message : "Data deleted successfully",
            data : lead
        })

    } catch (error) {
        next(error);
    }
}

const createNotesForLead = async(req, res, next) => {

    try{

        const { title, content } = req.body;
        const { id } = req.validatedParams;

        const note = await createNotesForLeadModel(id, title, content);

        res.json({
            success : true,
            message : "Note created successfully!",
            data : note 
        })

    } catch (error) {
        next(error);
    }
}

const getAllNotesForLead = async (req, res, next ) => {

    try{
        const { id }  = req.validatedParams;

        const notes = await getAllNotesForLeadModel(id);

        res.json({
            success : true,
            message : "All notes retrieved for the lead",
            data : notes
        })

    } catch(error) {
        next(error);
    }
}

const getDashboardStats = async (req, res, next) => {

    try{

        const data = await getDashboardStatsModel();


        res.json({
            success: true,
            message: "Data retrieved successfully!",
            data : data
        })

    } catch(error){
        next(error);
    }
}

const updateStatusById = async (req, res, next) =>{

    try{

        const { id } = req.validatedParams;

        if(!id){
            return next(createError(404, "Id not available"));
        }

        const { status } = req.body;

        const statusValues = ["not_contacted", "contacted", "follow_up_needed", "success", "failure"];

        if(!status || !statusValues.includes(status)){
            return next(createError(404, "Status data to be updated not available or wrong status option"));
        }

        const data = await updateStatusByIdModel(id, status);

        res.json({
            success: true,
            message: "Data updated successfully",
            data: data
        })


    } catch(error){
        next(error);
    }
}

const getAllStaff = async(req, res, next) =>{

    try{

        const staffs = await getAllStaffModel();

        if(!staffs[0]){
            return next(createError(404, "Data not found"))
        }

        res.json({
            success:true,
            message : "Staff data retrieved successfully!",
            data : staffs
        })

    } catch(error){
        next(error);
    }

}

const assignStaff = async(req, res, next) => {

    try{

        const currentUserId = req.user.userId;


        const user = await getUserData(currentUserId);

        const isAdmin = user.role === "admin";


        if(!isAdmin){
            return next(createError(401, "You are not authorized to perform the action"))
        }

        const leadId = req.params.leadId;
        const staffId = req.params.staffId;

        const result = await assignStaffModel(leadId, staffId);

        res.json({
            success : true,
            message : "Staff assigned to a lead successfully",
            data : result
        })

    } catch(error){
        next(error);
    }
}

const currentLeadUpdate = async(req, res, next)=>{

    try{

        const value = req.params.value;
        const staffId = req.params.staffId;

        const Lead = await currentLeadUpdateModel(staffId, value);

        res.json({
            success:true,
            message: "Lead updated successfully!",
            data : Lead
        })


    } catch(error){
        next(error);
    }
}

const successLeadUpdate = async(req, res, next)=>{

    try{

        const value = req.params.value;
        const staffId = req.params.staffId;

        const Lead = await successLeadUpdateModel(staffId, value);

        res.json({
            success:true,
            message: "Lead updated successfully!",
            data : Lead
        })


    } catch(error){
        next(error);
    }
}

const failureLeadUpdate = async(req, res, next)=>{

    try{

        const value = req.params.value;
        const staffId = req.params.staffId;

        const Lead = await failureLeadUpdateModel(staffId, value);

        res.json({
            success:true,
            message: "Lead updated successfully!",
            data : Lead
        })


    } catch(error){
        next(error);
    }
}


const totalLeadUpdate = async(req, res, next)=>{

    try{

        const value = req.params.value;
        const staffId = req.params.staffId;

        const Lead = await totalLeadUpdateModel(staffId, value);

        res.json({
            success:true,
            message: "Lead updated successfully!",
            data : Lead
        })


    } catch(error){
        next(error);
    }
}

module.exports = {
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
}