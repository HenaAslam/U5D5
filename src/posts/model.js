import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import usersModel from "../users/model.js";

const postsModel = sequelize.define("post", {
  postId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  text: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
});

usersModel.hasMany(postsModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});

postsModel.belongsTo(usersModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});

export default postsModel;
