import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});
