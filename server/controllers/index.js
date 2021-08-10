module.exports = {
  signup: require("./users/signup"),
  validation: require("./users/validation"),

  getArticleList: require("./articles/articlelist"),
  postArticle: require("./articles/article").post,
  getSingleArticle: require("./articles/article").get,
  editArticle: require("./articles/article").patch,
  deleteArticle: require("./articles/article").delete,
};
