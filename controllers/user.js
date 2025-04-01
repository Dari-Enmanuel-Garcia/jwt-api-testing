const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

//schemas
const userModel = require("../model/users")

//validation Schemas
const userValidationSchema = require("../validationSchema/users")

const userController ={
    async createUser(req,res){
        const { userEmail, userPassword, userProfile_photo, uusername } = req.body;

    if (!userEmail || !userPassword || !userProfile_photo || !uusername) {
        return res.status(400).json({ message: "Debes entregar datos como userEmail, userPassword, userProfile_photo, uusername" });
    }

    try {
        const existUser = await userModel.findOne({email:userEmail})

        if(existUser){
            return res.status(409).json({message:"Email ya utilizado"})
        }
        const results = await userValidationSchema.safeParse(req.body);
        
        if(!results.success){
            return res.status(400).json({message:"Datos invalidos"})
        }

        const hashPass= await bcrypt.hash(userPassword,10)

        const newUser=new userModel({
            email:userEmail,
            password:hashPass,
            profile_photo:userProfile_photo,
            username:uusername
        })

        await newUser.save()

        res.status(201).json({ message: "Usuario creado" });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor"});
    }
    },
    async loginUser(req,res){
        const {userEmail, userPassword}=req.body

        if(!userEmail ||!userPassword){
            return res.status(400).json({message:"Debes entregar userEmail, userPassword"})
        }

        try{
            const results = await userValidationSchema.safeParse(req.body)
            if(!results.success){
                return res.status(400).json({message:"Datos invalidos"})
            }

            const existUser = await userModel.findOne({email:userEmail})

            if(!existUser){
                return res.status(404).json({message:"El usuario no esta registrado"})
            }

            const isPassword = await bcrypt.compare(userPassword, existUser.password)

            if(!isPassword){
                return res.status(401).json({message:"Las passwords no coinciden"})
            }
            const {SECRET} = process.env
            const user = {email:userEmail}
            const token = jwt.sign(user,SECRET,{expiresIn:"1h"})
            return res.status(202).cookie("token", token, { httpOnly: true, maxAge: 3600000, secure:true, sameSite:"None" }).json({message:"Credenciales correctas"})
        }
        catch(err){
            console.log(err)
            return res.status(500).json({message:"Error interno al iniciar la sesion"})
        }
    },

    async getUserDataWithEmail(req,res){
        const {userEmail} = req.body

        if(!userEmail){
            return res.status(400).json({message:"Debes entregar userEmail"})
        }

        const result = await userValidationSchema.safeParse(req.body)

        if(!result.success){
            return res.status(400).json({message:"Datos no validos"})
        }

        try {
            const existUser = await userModel.findOne({email:userEmail})

            if(!existUser){
                return res.status(404).json({message:"Usuario no existe"})
            }
            const {profile_photo, username} = existUser
            return res.status(200).json({profile_photo:profile_photo,username:username})
        } catch (error) {
            return res.status(500).json({message:"Internal server error"})
        }
    },
    async verifyToken(req, res) {
        try {
            const token = req.cookies.token;
            
            if (!token) {
                return res.status(200).json({ valid: false });
            }
            
            const { SECRET } = process.env;
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    return res.status(200).json({ valid: false });
                }
                res.status(200).json({ valid: true, user: decoded });
            });
        } catch (error) {
            res.status(200).json({ valid: false });
        }
    }
}

module.exports = userController
