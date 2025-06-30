import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("gpsapp", "gpsuser", "비밀번호", {
  host: "localhost",
  dialect: "mysql",
});
