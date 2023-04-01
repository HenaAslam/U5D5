import express from "express";
import usersModel from "../users/model.js";
import postsModel from "./model.js";
import createHttpError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import commentsModel from "../comments/model.js";
const postsRouter = express.Router();

postsRouter.post("/", async (req, res, next) => {
  try {
    const { postId } = await postsModel.create(req.body);
    res.status(201).send(postId);
  } catch (error) {
    next(error);
  }
});

postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await postsModel.findAll({
      attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
      include: [
        { model: usersModel, attributes: ["userId", "name"] },
        {
          model: commentsModel,
          attributes: ["comment"],
          include: { model: usersModel, attributes: ["name"] },
        },
      ],
    });
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await postsModel.findByPk(req.params.postId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (post) {
      res.send(post);
    } else {
      next(
        createHttpError(404, `post with id ${req.params.postId} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.put("/:postId", async (req, res, next) => {
  try {
    const [numberOfupdatedRecords, updatedRecords] = await postsModel.update(
      req.body,
      {
        where: { postId: req.params.postId },
        returning: true,
      }
    );
    if (numberOfupdatedRecords === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `post with id ${req.params.postId} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});
postsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const numberOfdeletedUsers = await postsModel.destroy({
      where: { postId: req.params.postId },
    });
    if (numberOfdeletedUsers === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `post with id ${req.params.postId} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "linkedin/post",
    },
  }),
}).single("post");

postsRouter.post(
  "/:postId/uploadImage",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      if (req.file) {
        const post = await postsModel.findByPk(req.params.postId);
        if (post) {
          post.image = req.file.path;
          await post.save();
          res.send("uploaded");
        } else {
          next(
            createHttpError(404, `post with id ${req.params.postId} not found`)
          );
        }
      } else {
        next(createHttpError(400, "upload an image"));
      }
    } catch (error) {
      next(error);
    }
  }
);

postsRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const post = await postsModel.findByPk(req.params.postId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: commentsModel,
          attributes: ["comment", "commentId"],
          include: [
            {
              model: usersModel,
              attributes: ["name", "surname"],
            },
          ],
        },
      ],
    });
    res.send(post);
  } catch (error) {
    next(error);
  }
});

export default postsRouter;
