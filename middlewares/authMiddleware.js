const createError = require("http-errors");
const jwt = require("jsonwebtoken");


const validateMiddleware = (req, res, next) =>{

    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return next(createError(400, "All fields are required"));
    }

    next();

}

const validateLoginMiddleware = (req, res, next) =>{

    const { email , password } = req.body;

    if(!email || !password ){
        return next(createError(400, "All fields are required"));
    }

    next();
}

const protectMiddleware = (req, res, next) => {

    try{

        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return next(createError(401, "Unauthorized! Please login to access the resources!"))
        }

        const token = authHeader.split(" ")[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = payload;

        next();


    } catch (error){
         next(createError(401, "Unauthorized! Please login to access the resources!"))
    }
}


module.exports = {
    validateMiddleware,
    protectMiddleware,
    validateLoginMiddleware,
}