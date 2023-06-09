const express = require("express")
const { login, gLogin, register, refresh, logout } = require("../controller/auth")

const router = express.Router()

router.post('/login', login)
router.post('/google-login', gLogin)
router.post("/register", register)

router.get("/refresh", refresh)
router.get("/logout", logout)


module.exports = router
