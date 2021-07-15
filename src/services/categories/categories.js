import express from "express"
import { Comment, Author, Blog, Category } from "../../db/index.js"
import sequelize from "sequelize"

const { Op } = sequelize
const categoriesRouter = express.Router()

/* ***************categories********************* */

categoriesRouter.route("/")
.get( async (req, res, next) => {
    try {
        const data = await Category.findAll()
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error)
    }
})
.post( async (req, res, next) => {
    try {
        const data = await Category.create(req.body)
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

categoriesRouter.route("/blogs/:blogId")
.get( async (req, res, next) => {
    try {
        const data = await Comment.findAll({
            where: {
                blogId: req.params.blogId
            },
            include: [{
                model: Author,
                attributes: ["name", "surname"]}]
        })
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error) 
    }
})

categoriesRouter.route("/authors/:authorId")
.get( async (req, res, next) => {
    try {
        const data = await Comment.findAll({
            where: {
                authorId: req.params.authorId
            },
            include: [{
                model: Author,
                attributes: ["name", "surname"]},
                {model: Blog,
                attributes: ["category", "title", "content"]
            }]
        })
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error) 
    }
})

categoriesRouter.route("/:authorId/:blogId")
.get( async (req, res, next) => {
    try {
       const blogData = await Comment.findAll({
           where: {
               blogId: req.params.blogId,
               authorId: req.params.authorId
           }
       })

       const groupBy = await Comment.findAll({
        where: {
            blogId: req.params.blogId,
            authorId: req.params.authorId
        },
        include: [{
            model: Author,
            attributes: ["name", "surname"]},
            {model: Blog,
            attributes: ["category", "title", "content"]
        }]
       })
       res.send(groupBy)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

categoriesRouter.route("/:authorId/:blogId")
.put( async (req, res, next) => {
    try {
        const { authorId, blogId } = req.params
        const rowCount = await Comment.destroy({
            where: { blogId, authorId},
            limit: !req.query.all && 1,
        })
        if (rowCount > 0) {
            res.send("comment deleted");
          } else {
            res.status(404).send("comment not found");
          }
    } catch (error) {
        console.log(error);
        next(error)
    }
})
.delete ( async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(error)
    }
})

export default categoriesRouter
