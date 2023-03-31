import express from "express";
import experienceModel from "./model.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import usersModel from "../users/model.js";
import createHttpError from "http-errors";

const experieceRouter = express.Router();

experieceRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    const { experienceId } = await experienceModel.create({
      userId: req.params.userId,
      ...req.body,
    });

    res.status(201).send({ experienceId });
  } catch (error) {
    next(error);
  }
});

experieceRouter.put(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    try {
      const [numberOfupdatedRecords, updatedRecords] =
        await experienceModel.update(req.body, {
          where: { experienceId: req.params.experienceId },
          returning: true,
        });
      if (numberOfupdatedRecords === 1) {
        res.send(updatedRecords[0]);
      } else {
        next(
          createHttpError(
            404,
            `experience with id ${req.params.experienceId} does not exist`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

experieceRouter.delete(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    try {
      const numberOfdeletedReviews = await experienceModel.destroy({
        where: { experienceId: req.params.experienceId },
      });
      if (numberOfdeletedReviews === 1) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `experience with id ${req.params.experienceId} does not exist`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "linkedin/exp",
    },
  }),
}).single("exp");

experieceRouter.post(
  "/:userId/experiences/:experienceId/uploadImage",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      if (req.file) {
        const exp = await experienceModel.findByPk(req.params.experienceId);
        if (exp) {
          exp.image = req.file.path;
          await exp.save();
          res.send("uploaded");
        } else {
          next(
            createHttpError(
              404,
              `experience with id ${req.params.experienceId} not found`
            )
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

export default experieceRouter;
