const express = require("express")
const router = express.Router();

const { getAffShare, setAffShare, getUsers, getGames, getTours, addNewGame } = require("../controller/admin")

router.post('/setAffShare', setAffShare)
router.post('/getAffShare', getAffShare)
router.post('/getUsers', getUsers)
router.post('/getGames', getGames)
router.post('/getTours', getTours)
router.post('/addNewGame', addNewGame)

module.exports = router
