import sequelize from "./index.js";
import s from "sequelize"
const { DataTypes } = s

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isIn: [
                ["Education", "Travel", "Music", "Lifestyle", "Food", "Programming", "DIY", "Sports", "Fashion", "Movie", "Book"]
            ]
        }
    }
})

export default Category