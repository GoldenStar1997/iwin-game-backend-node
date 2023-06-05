const express=require("express")
const { usernameIsUnique, getUserWithUsername, updateUser, sendResetPasswordLink, resetPassword, addNewGameInfo} = require("../controller/user")

const router= express.Router()

router.post("/checkUsername", usernameIsUnique)
router.post("/getUserWithUsername",getUserWithUsername)
router.patch("/updateUser", updateUser)
router.post("/sendResetPasswordLink",sendResetPasswordLink)
router.patch("/resetPassword",resetPassword);
router.put("/addNewGameInfo", addNewGameInfo)



module.exports=router