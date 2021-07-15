import sequelize from "./index.js";
import s from "sequelize"
const { DataTypes } = s

const Comment = sequelize.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text:{
        type: DataTypes.TEXT,
        allowNull: false,
    }
})

export default Comment