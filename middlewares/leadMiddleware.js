const { getUserData } = require("../models/authModels");
const createError = require("http-errors")

const adminVerifyHandler = async (req, res, next) => {

    try{

    
        const userId = req.user.userId;

        const user = await getUserData(userId);

        if(user.role !== "admin"){
            return next(createError(403, "You are not authorized to access the resource"));
        }

        next();

    } catch(error){
        next(error);
    }
}

const validate = (schema) => (req, res, next) => {

    const result = schema.safeParse(req.body);

    if(!result.success){
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: result.error.issues.map((error)=>(
                {
                    field : error.path[0],
                    message : error.message
                }
            ))
        });
    }

    req.validatedData = result.data;

    next();
}

const validateParams = (schema) => (req, res, next) =>{

    const result = schema.safeParse(req.params);

    if(!result.success){
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors : result.error.issues.map((issue)=>({
                field : issue.path[0],
                message : issue.message
            }))
        })
    }

    req.validatedParams = result.data;

    next();
}

module.exports = {
    adminVerifyHandler,
    validate,
    validateParams
}