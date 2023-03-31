import express from "express";
import usersModel from "./model.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import experienceModel from "../experiences/model.js";
import createHttpError from "http-errors";
import postsModel from "../posts/model.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const { userId } = await usersModel.create(req.body);
    res.status(201).send(userId);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await usersModel.findAll({
      attributes: ["name", "surname", "userId", "title", "image"],
      include: [
        { model: experienceModel, attributes: ["role", "area"] },
        { model: postsModel, attributes: ["postId"] },
      ],
    });
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await usersModel.findByPk(req.params.userId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `user with id ${req.params.userId} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const [numberOfupdatedRecords, updatedRecords] = await usersModel.update(
      req.body,
      {
        where: { userId: req.params.userId },
        returning: true,
      }
    );
    if (numberOfupdatedRecords === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(404, `user with id ${req.params.userId} does not exist`)
      );
    }
  } catch (error) {
    next(error);
  }
});
usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const numberOfdeletedUsers = await usersModel.destroy({
      where: { userId: req.params.userId },
    });
    if (numberOfdeletedUsers === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `user with id ${req.params.userId} does not exist`)
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
      folder: "linkedin/user",
    },
  }),
}).single("user");

usersRouter.post(
  "/:userId/uploadImage",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      if (req.file) {
        const user = await usersModel.findByPk(req.params.userId);
        if (user) {
          user.image = req.file.path;
          await user.save();
          res.send("uploaded");
        } else {
          next(
            createHttpError(404, `user with id ${req.params.userId} not found`)
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

usersRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const user = await usersModel.findByPk(req.params.userId, {
      attributes: ["name", "surname", "userId"],
      include: [
        {
          model: experienceModel,
          attributes: ["role", "area", "experienceId", "company"],
        },
      ],
    });
    res.send(user);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
