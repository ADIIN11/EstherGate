const express = require("express")
const path = require("path")
const axios = require("axios")




require('dotenv').config({ quiet: true });

const {productsList,userList} = require("./data");

const mongoose= require("mongoose");
const { exit } = require("process");

mongoose.connect(process.env.MONGO_DB_URL).then(()=>console.log("MongoDB Connected Successfully :)")).catch(err=>{console.log("MongoDB Connection Error :",err)
})








const authRoutes=require("./routes/authRoutes")
const commonRoutes=require("./routes/commonRoutes")
const profileRoutes=require("./routes/profileRoutes")


const app = express();

app.use(express.json())

const PORT = process.env.PORT


app.use("/Auth",authRoutes)

app.use("",commonRoutes)

app.use("/Profile",profileRoutes)

app.use(express.static(path.join(__dirname, "public")))


app.get("/Store", (req, res) => {
  res.sendFile(path.join(__dirname, "Store.html"))
})




















app.use((req, res) => {
  res.status(404).send("Page Not Found")
})

app.listen(PORT, () => {
  console.log("server is running")
  console.log("welcome to Esther Gate")
  console.log(`Listening on port ${PORT}`)
})



















