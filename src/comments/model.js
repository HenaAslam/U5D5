import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import postsModel from "../posts/model.js";
import usersModel from "../users/model.js";

const commentsModel = sequelize.define("comment", {
  commentId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  comment: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
});

postsModel.hasMany(commentsModel, {
  foreignKey: { name: "postId", allowNull: false },
  onDelete: "CASCADE",
});

commentsModel.belongsTo(postsModel, {
  foreignKey: { name: "postId", allowNull: false },
  onDelete: "CASCADE",
});

usersModel.hasMany(commentsModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});

commentsModel.belongsTo(usersModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});
export default commentsModel;
