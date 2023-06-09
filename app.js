const express = require("express")
const app = express()
const mongoose = require("mongoose")
const multer = require("multer")
const path = require("path")
const port = 3000

const Blog=require("./model/post")

const authRoute = require("./routes/auth")
const authUser = require("./routes/user")
const authPost = require("./routes/post")

app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")))

mongoose.connect('mongodb://0.0.0.0:27017/Data', {
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=>'Connected to MongoDB').catch(err => console.error('Something went wrong', err))

const storage = multer.diskStorage({
    destination: (req, file, callb) => {
      callb(null, "images")
    },
    filename: (req, file, callb) => {
      //callb(null, "file.png")
      callb(null, req.body.name)
    },
})
const upload = multer({ storage: storage })
  app.post("/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded")
})
  

app.use("/auth", authRoute)
app.use("/users", authUser)
app.use("/post", authPost)

app.set('view engine', 'ejs')

app.get('/',async(req, res)=>
{
    const blogs= await Blog.find().sort({createdAt: 'desc'})
    res.render("index.ejs", {blogs: blogs})
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })  