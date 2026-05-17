const mongoose = require("mongoose");


const connectDB = async ()=>{

    try{

        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to the database successfully");

    } catch(error){

        console.log(`Database connection failed: ${error.message}`);
        process.exit(1);
        
    }
}

module.exports = connectDB;