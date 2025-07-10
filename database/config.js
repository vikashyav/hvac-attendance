const { Sequelize } = require("sequelize")
// import { Sequelize } from 'sequelize'; // ✅ ESM compatible

require("dotenv").config()

const localCon = {
  username: "postgres",
  password: "password",
  database: "hvac_attendance",
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false,//process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
};

const sequelize = new Sequelize(localCon)

module.exports = sequelize

//  {
//   dialect: 'postgres',
//   dialectOptions:{ require: true, rejectUnauthorized: false }
// }