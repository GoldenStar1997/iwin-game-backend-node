const express = require("express")
const cors = require('cors');

const authRoute = require("./routes/auth")
// const userRoute = require("./routes/user")
// const adminRoute = require("./routes/admin")

const app = express()
const PORT = 4000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());


app.use("/auth", authRoute);
// app.use("/user", userRoute);
// app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log(`server is online on port ${PORT}`);
})