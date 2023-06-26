const express = require("express")
const { getAffShare, setAffShare } = require("../controller/admin")

const router = express.Router()

router.post('/setAffShare', setAffShare)
router.post('/getAffShare', getAffShare)

module.exports = router
