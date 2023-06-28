const express=require("express")
const { games, getPlayers, setAdsClks, getAffShare } = require("../controller/user")

const router= express.Router()

router.post('/games', games)
router.post('/getPlayers', getPlayers)
router.post('/setAdsClks', setAdsClks)
router.post('/getAffShare', getAffShare)

module.exports=router