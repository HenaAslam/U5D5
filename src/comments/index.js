import express from "express";
import commentsModel from "./model.js";

const commentsRouter = express.Router();

commentsRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const { commentId } = await commentsModel.create({
      postId: req.params.postId,
      ...req.body,
    });

    res.status(201).send({ commentId });
  } catch (error) {
    next(error);
  }
});

commentsRouter.put("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const [numberOfupdatedRecords, updatedRecords] = await commentsModel.update(
      req.body,
      {
        where: { commentId: req.params.commentId },
        returning: true,
      }
    );
    if (numberOfupdatedRecords === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(
        createHttpError(
          404,
          `comment with id ${req.params.commentId} does not exist`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

commentsRouter.delete(
  "/:postId/comments/:commentId",
  async (req, res, next) => {
    try {
      const numberOfdeletedReviews = await commentsModel.destroy({
        where: { commentId: req.params.commentId },
      });
      if (numberOfdeletedReviews === 1) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `comment with id ${req.params.commentId} does not exist`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default commentsRouter;
