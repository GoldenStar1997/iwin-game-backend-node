const express=require("express")
const { games, getPlayers } = require("../controller/user")

const router= express.Router()

router.post('/games', games)
router.post('/getPlayers', getPlayers)



module.exports=router