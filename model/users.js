const mongoose = require("mongoose")
const { string } = require("zod")
const mongoSchema = mongoose.Schema

const userSchema = mongoSchema({
    email:{
        type:String
    },
    password:{
        type:String
    },
    profile_photo:{
        type:String
    },
    username:{
        type:String
    },
})

module.exports = mongoose.model("users",userSchema)