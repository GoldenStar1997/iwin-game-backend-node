const express=require("express")
const { games, getPlayers, setAdsClks } = require("../controller/user")

const router= express.Router()

router.post('/games', games)
router.post('/getPlayers', getPlayers)
router.post('/setAdsClks', setAdsClks)

module.exports=router