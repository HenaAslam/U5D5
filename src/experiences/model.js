import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import usersModel from "../users/model.js";

const experienceModel = sequelize.define("experience", {
  experienceId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  role: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(500),
  },
});

usersModel.hasMany(experienceModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});

experienceModel.belongsTo(usersModel, {
  foreignKey: { name: "userId", allowNull: false },
  onDelete: "CASCADE",
});

export default experienceModel;
