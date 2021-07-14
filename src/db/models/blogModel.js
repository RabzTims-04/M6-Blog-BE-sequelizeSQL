import sequelize from "./index.js";
import s from "sequelize"
const { DataTypes } = s

const Blog = sequelize.define('blog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cover: {
        type: DataTypes.STRING,
        allowNull: false
    },
    read_time_value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    read_time_unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    authorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    }
})

export default Blog