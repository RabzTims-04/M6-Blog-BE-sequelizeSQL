import express from "express"
import { Author } from "../../db/index.js"
import sequelize from "sequelize"
import createError from 'http-errors'
import { queryFilter } from "../../lib/query/query.js"

const { Op } = sequelize
const authorsRouter = express.Router()

/* ***************authors********************* */

authorsRouter.route("/")
.get( async (req, res, next) => {
    try {
       console.log(queryFilter(req.query));
       const filter = queryFilter(req.query)
       const data = await Author.findAll({
           where: filter.length > 0 ? {[Op.or]: filter } : {}
       })
       res.send(data)
    } catch (error) {
        console.log(error);
        next(error)
    }
})
.post( async (req, res, next) => {
    try {
        const data = await Author.create(req.body)
        res.send(data)
    } catch (error) {
        console.log(error);
        next(error)
    }
})

authorsRouter.route("/:id")
.get( async (req, res, next) => {
    try {
        const data = await Author.findByPk(req.params.id)
      res.send(data);
    } catch (error) {
        console.log(error);
        next(error)
    }
})
.put( async (req, res, next) => {
    try {
        const data = await Author.update(req.body, {
            where: {
                id: req.params.id
            },
            returning:true
        })
        res.send(data[1][0])
    } catch (error) {
        console.log(error);
        next(error)
    }
})
.delete ( async (req, res, next) => {
    try {
        const rowsCount = await Author.destroy({
            where: {
                id: req.params.id
            }
        })
        if(rowsCount > 0){
            res.send('deleted successfully')
        }
        else{
            res.send("error while deleting")
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

export default authorsRouter
