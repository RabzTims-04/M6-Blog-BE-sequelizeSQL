import express from "express";
import sequelize from "sequelize";
import { Blog, Author, Comment, Category } from "../../db/index.js";
import createError from "http-errors";
import axios from "axios";
import { pipeline } from "stream";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  generatePDFReadableStream,
  stream2Buffer,
} from "../../lib/pdf/index.js";

const { Op } = sequelize;
const blogsRouter = express.Router();

/* ***************blogs********************* */

blogsRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      console.log("QUERY", req.query.category);
      const data = await Blog.findAll({
        include: [
          {
            model: Author,
            where: req.query.author
              ? {[Op.or] : [{ name : { [Op.iLike]: `%${req.query.author}%`}} , { surname : { [Op.iLike]: `%${req.query.author}%`}}]}
              :{}
          },
          {
            as: "category",
            model: Category,
            attributes: ["name", ["id", "categoryId"]],
            where: req.query.category
              ? { name: { [Op.iLike]: `%${req.query.category}%` } }
              : {},
          },
          {
            model: Comment,
            attributes: ["text", ["id", "commentId"]],
            include: [
              {
                model: Author,
                attributes: ["name", "surname", "avatar", ["id", "authorId"]],
              },
            ],
          },
        ],
        where: req.query.title 
            ? {title: { [Op.iLike]: `%${req.query.title}%`}} 
            : {}
      });
      res.send(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      let {
        category,
        title,
        cover,
        read_time_value,
        read_time_unit,
        content,
        author,
      } = req.body;
      const data = await Blog.create(req.body);
      res.send(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

blogsRouter.route("/author").get(async (req, res, next) => {
  try {
    const data = await Author.findAll({
      include: [{ model: Blog }],
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

blogsRouter.route("/author/:authorId").get(async (req, res, next) => {
  try {
    const data = await Author.findByPk(req.params.authorId, {
      include: [{ model: Blog }],
    });
    res.send(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

blogsRouter
  .route("/:id")
  .get(async (req, res, next) => {
    try {
      const data = await Blog.findByPk(req.params.id);
      res.send(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .put(async (req, res, next) => {
    try {
      const data = await Blog.update(req.body, {
        where: {
          id: req.params.id,
        },
        returning: true,
      });
      res.send(data[1][0]);
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const rowsCount = await Blog.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (rowsCount > 0) {
        res.send("deleted successfully");
      } else {
        res.send("error while deleting");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogs",
  },
});

const uploadOnCloudinary = multer({ storage: cloudinaryStorage }).single(
  "cover"
);

blogsRouter
  .route("/:blogId/cover")
  .post(uploadOnCloudinary, async (req, res, next) => {
    try {
      const blogId = req.params.blogId;
      const newCover = { cover: req.file.path };
      const url = newCover.cover;
      const blog = await Blog.findByPk(blogId);
      console.log(url);
      if (blog) {
        blog.cover = url;
        const coverData = await Blog.update(
          { cover: url },
          {
            where: {
              id: blogId,
            },
            returning: true,
          }
        );
        console.log(coverData);

        res.send(coverData[1][0]);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

blogsRouter.route("/:blogId/pdf").get(async (req, res, next) => {
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findByPk(blogId);
    console.log(blog);
    if (blog) {
      const authorObj = await Author.findByPk(blog.authorId);
      console.log(authorObj);
      console.log(blog.cover);
      const response = await axios.get(blog.cover, {
        responseType: "arraybuffer",
      });
      const mediaPath = blog.cover.split("/");
      const filename = mediaPath[mediaPath.length - 1];
      const [id, extension] = filename.split(".");
      const base64 = Buffer.from(response.data).toString("base64");
      const base64Image = `data:image/${extension};base64,${base64}`;
      const source = generatePDFReadableStream(blog, base64Image, authorObj);
      const destination = res;
      pipeline(source, destination, (err) => {
        if (err) {
          next(err);
        }
      });
    } else {
      next(createError(404, `blog with id: ${blogId} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default blogsRouter;
