import express from "express"
import { Author } from "../../db/index.js"
import sequelize from "sequelize"
import createError from 'http-errors'
import { queryFilter } from "../../lib/query/query.js"
import multer from "multer";
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

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

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params:{
    folder:"blogs"
    }
})

const uploadOnCloudinary = multer({ storage: cloudinaryStorage}).single("avatar")

authorsRouter.route("/:authorId/profile")
.post( uploadOnCloudinary, async (req, res, next) => {
    try {
        const authorId = req.params.authorId
        const newProfile = { avatar: req.file.path }
        const url = newProfile.avatar
        const author = await Author.findByPk(authorId)
        console.log(url);
        if(author){
            author.avatar = url
            const avatarData = await Author.update({avatar:url}, {
              where: {
                  id: authorId
              },
              returning:true
          })
          console.log(avatarData);

            res.send(avatarData[1][0]);
        } 
    } catch (error) {
        console.log(error);
        next(error)
    }
})

export default authorsRouter
