const zod = require("zod");

const userValidationSchema = zod.object({
    userEmail:zod.string().min(8).max(100).email().optional(),
    userPassword:zod.string().min(8).max(50).optional(),
    userProfile_photo:zod.string().min(8).max(200).optional(),
    uusername:zod.string().min(6).max(50).optional()
})

module.exports = userValidationSchema