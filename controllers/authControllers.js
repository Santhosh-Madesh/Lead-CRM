const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
    createUser,
    findUserByEmail,
    getUserData,
} = require("../models/authModels");


const registerUser = async (req, res, next) => {

    try{

        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await createUser(name, email, hashedPassword);

        if(!user){
            return next(createError(400, "User registration failed"));
        }

        const {password: _, ...safeUser} = user.toObject(); 

        

        

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data : safeUser
        })

    } catch(error){
        next(error);
    }
}

const loginUser = async (req, res, next) => {

    try{

        const { email, password } = req.body;

        // Check if email exists

        const user = await findUserByEmail(email);


        if(!user){
            return next(createError(404, "User not found"));
        }

        // Check if password matches 
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return next(createError(401, "Invalid credentials"));
        }

        // Create JWT token
        const token = await jwt.sign({ userId: user._id } , process.env.JWT_SECRET, { expiresIn : "1d"});

        // Return token in responses
        res.status(200).json({
            success:true,
            message : "Login successful",
            data : {
                username : user.name,
                email : user.email,
                token : token
            }
        })

    } catch(error){
        next(error);
    }
}

const profile = async (req, res, next) => {

    try {

        const id = req.user.userId;

        const user = await getUserData(id);

        res.json({
            success: true,
            message : "Profile data retrived successfully",
            data : {
                user : {
                    name : user.name,
                    email : user.email,
                    role : user.role,
                    userId : user._id,
                    total_leads : user.total_leads,
                    current_leads : user.current_leads,
                    successful_leads : user.successful_leads,
                    unsuccessful_leads : user.unsuccessful_leads
                }
            }
        })

    } catch (error) {
        next(error);
    }
}



module.exports = {
    registerUser,
    loginUser,
    profile,

}
