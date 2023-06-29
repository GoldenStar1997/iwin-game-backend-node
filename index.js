const express = require("express")
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const adminRoute = require("./routes/admin")

const app = express()
const PORT = 4000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors("*"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/admin", upload.single('file'), adminRoute);

app.listen(PORT, () => {
  console.log(`server is online on port ${PORT}`);
})