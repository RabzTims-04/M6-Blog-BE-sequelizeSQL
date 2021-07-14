import sequelize from "./models/index.js";
import striptags from "striptags";
import Blog from "./models/blogModel.js";
import Author from "./models/authorModel.js";

Author.hasMany(Blog)
Blog.belongsTo(Author)

Blog.beforeValidate((user) => {
    user.read_time_value = Math.floor(striptags(user.content).length / 228) + 1;
    user.read_time_unit = user.read_time_value === 1 ? "minute" : "minutes";
    user.content = striptags(user.content);
})

Author.beforeValidate((user) => {
    if(!user.avatar){
        user.avatar = `https://eu.ui-avatars.com/api/?name=${user.name}+${user.surname}`
    }
})

export { sequelize, Blog, Author }