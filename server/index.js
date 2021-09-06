const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const {
  getArticleList,
  getCategorizedArticleList,
  postArticle,
  getSingleArticle,
  editArticle,
  deleteArticle,
  likebtn,
  signup,
  signin,
  auth,
  signout,
  validation,
  edituser,
  deleteuser,
  oauth,
  userimage,
} = require("./controllers");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["https://ssg-ga.click", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE"],
  })
);
app.use(cookieParser());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user/image", userimage.upload.single("image"), userimage.sendPost);
app.post("/user/signup", signup);
app.post("/user/signin", signin);
app.post("/user/validation", validation);
app.post("/user/oauth", oauth);
app.get("/user/auth", auth);
app.get("/user/signout", signout);
app.patch("/user", edituser);
app.delete("/user", deleteuser);

app.get("/article", getArticleList);
app.get("/article/category", getCategorizedArticleList);
app.post("/article", postArticle);
app.get("/article/id/:articleId", getSingleArticle);
app.patch("/article/id/:articleId", editArticle);
app.delete("/article/id/:articleId", deleteArticle);
app.post("/article/likebtn", likebtn);

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Example app listening at https://api.ssg-ga.click:${process.env.SERVER_PORT}`
  );
});
