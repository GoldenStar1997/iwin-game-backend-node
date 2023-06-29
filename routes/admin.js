const express = require("express")

const { getAffShare, setAffShare, getUsers, getGames, getTours, addNewGame } = require("../controller/admin")

const router = express.Router()


router.post('/setAffShare', setAffShare)
router.post('/getAffShare', getAffShare)
router.post('/getUsers', getUsers)
router.post('/getGames', getGames)
router.post('/getTours', getTours)
router.post('/addNewGame', upload.single('file'), addNewGame)

module.exports = router
