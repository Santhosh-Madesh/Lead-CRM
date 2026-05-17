const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    }, 
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        required:true,
    },
    role:{
        type: String,
        enum : ["staff", "admin"],
        default : "staff",
    },
    total_leads : {
        type : Number,
        default : 0
    }, 
    current_leads : {
        type : Number,
        default : 0
    },
    successful_leads : {
        type : Number,
        default : 0
    },
    unsuccessful_leads : {
        type : Number,
        default : 0
    }
},
{
    timestamps:true,
})

const user = mongoose.model("User", userSchema);


// Auth Methods

const createUser = async (name, email, password) =>{


    const User = await user.create({
        name, 
        email,
        password,
    });

    

    return User;
}

const findUserByEmail = async (email) =>{

    const User = await user.findOne({email: email});

    return User;
}

const getUserData = async (id) => {

    const User = await user.findOne({_id:id});
    
    return User;
}

const getAllStaffModel = async () => {

    
    const staffs = await user.find({role:"staff"});


    return staffs;
}



module.exports = {
    createUser,
    findUserByEmail,
    getUserData,
    user,
    getAllStaffModel
}