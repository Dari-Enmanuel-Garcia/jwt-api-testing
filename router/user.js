const router = require("express").Router()
const userController = require("../controllers/user")

router.post("/users/createUser",userController.createUser)
router.post("/users/loginUser",userController.loginUser)
router.post("/users/getUserDataWithEmail",userController.getUserDataWithEmail)
router.get("/users/verifyToken",userController.verifyToken)


module.exports = router