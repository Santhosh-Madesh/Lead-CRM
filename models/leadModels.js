const mongoose = require("mongoose");

const { user } = require("./authModels");

const noteScheme = new mongoose.Schema({
    title:{
        type : String,
        required : true,
        trim : true
    },
    content : {
        type : String,
        required : true,
        trim : true,
    }
},{
    timestamps : true
})

const Note = mongoose.model("Note", noteScheme);


const leadSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true,
        trim : true,
    },
    status : {
        type : String,
        enum : ["not_contacted", "contacted", "follow_up_needed", "success", "failure"],
        default : "not_contacted"
    },
    contact : {
        type : String, 
        required : true,
        trim : true
    },
    notes : [mongoose.Schema.Types.ObjectId]
    ,
    staff:{
        type: mongoose.Schema.Types.ObjectId,
        ref : user,
    }

}, {
    timestamps : true
})

const lead = mongoose.model("Lead", leadSchema);


const getAllLeadsModel = async (filter, sortBy, limit, skip) => {

    

    if(filter){
        return await lead.find(filter).sort(sortBy).limit(limit).skip(skip);
    } else {
        return await lead.find();
    }

}

const getLeadByIdModel = async (id) => {
    
    const Lead = await lead.findOne({_id:id});

    return Lead;
}


const createLeadModel = async (name, contact) => {

    const Lead = await lead.create({name:name, contact:contact});

    return Lead;
}

const updateLeadByIdModel = async (id, name, contact) => {

    const Lead = await lead.findByIdAndUpdate(id, {name : name, contact : contact});

    return Lead;

}

const deleteLeadByIdModel = async (id) => {

    const LeadUser = await lead.findOne({_id:id});
    
    if(!LeadUser){
        return null;
    }

    const Notes = await Note.deleteMany({_id: {$in : LeadUser.notes}});

    const Lead = await lead.findByIdAndDelete(id);


    return Lead;
}

const createNotesForLeadModel = async (id, title, content) => {

    const note = await Note.create({title: title, content: content});

    const Lead = await lead.findOne({_id:id});

    Lead.notes.push(note.id);
    await Lead.save();

    return Lead;
}


const getAllNotesForLeadModel = async (id) => {

    const Lead = await getLeadByIdModel(id);


    return await Note.find({
        _id: { $in : Lead.notes}
    })
}

const getDashboardStatsModel = async () => {

    const leads = await getAllLeadsModel();

    const staffs = await user.find({role : "staff"});

    const result = {
        leads : leads,
        staffs : staffs
    }

    return result;

}

const updateStatusByIdModel = async (id, status) => {

    const updatedLead = await lead.findByIdAndUpdate(id, { status : status });

    return updatedLead;
}

const assignStaffModel = async (leadId, staffId) => {

    const Lead = await lead.findByIdAndUpdate(leadId, {staff : staffId});

    return Lead;
}

const currentLeadUpdateModel = async (staffId, value) =>{
    
    const Lead = await user.findByIdAndUpdate(staffId, {current_leads: value});

    return Lead;
}

const successLeadUpdateModel = async (staffId, value) =>{
    
    const Lead = await user.findByIdAndUpdate(staffId, {successful_leads: value});

    return Lead;
}

const failureLeadUpdateModel = async (staffId, value) =>{
    
    const Lead = await user.findByIdAndUpdate(staffId, {unsuccessful_leads: value});

    return Lead;
}

const totalLeadUpdateModel = async (staffId, value) => {

    const Lead = await user.findByIdAndUpdate(staffId, {total_leads: value});

    return Lead;
}

const getLeadCountModel = async(filter)=>{

    const count = await lead.countDocuments(filter);


    return count;
}

module.exports = {
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
    leadSchema,
    getLeadCountModel,

}