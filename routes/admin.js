const express = require("express")
const { getAffShare, setAffShare, getUsers, getGames, getTours } = require("../controller/admin")

const router = express.Router()

router.post('/setAffShare', setAffShare)
router.post('/getAffShare', getAffShare)
router.post('/getUsers', getUsers)
router.post('/getGames', getGames)
router.post('/getTours', getTours)

module.exports = router
