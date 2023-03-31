import express from "express";
import cors from "cors";
import { pgConnect } from "./db.js";

import {
  badRequestErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
} from "./errorHandlers.js";

import usersRouter from "./users/index.js";
import experieceRouter from "./experiences/index.js";
import postsRouter from "./posts/index.js";
import commentsRouter from "./comments/index.js";

const server = express();
const port = process.env.PORT;

server.use(cors());
server.use(express.json());

server.use("/users", experieceRouter);
server.use("/users", usersRouter);
server.use("/posts", postsRouter);
server.use("/posts", commentsRouter);
server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);
await pgConnect();

server.listen(port, () => {
  console.log(`Sever is running on port ${port}`);
});
