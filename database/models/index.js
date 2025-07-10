const sequelize = require("../config")
const User = require("./User")
const Employee = require("./Employee")
const Attendance = require("./Attendance")
const JobSite = require("./JobSite")
const Schedule = require("./Schedule")
const Performance = require("./Performance")

// Define associations
User.hasOne(Employee, { foreignKey: "userId", as: "employee" })
Employee.belongsTo(User, { foreignKey: "userId", as: "user" })

Employee.hasMany(Attendance, { foreignKey: "employeeId", as: "attendances" })
Attendance.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" })

JobSite.hasMany(Attendance, { foreignKey: "jobSiteId", as: "attendances" })
Attendance.belongsTo(JobSite, { foreignKey: "jobSiteId", as: "jobSite" })

Employee.hasMany(Schedule, { foreignKey: "employeeId", as: "schedules" })
Schedule.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" })

JobSite.hasMany(Schedule, { foreignKey: "jobSiteId", as: "schedules" })
Schedule.belongsTo(JobSite, { foreignKey: "jobSiteId", as: "jobSite" })

Employee.hasMany(Performance, { foreignKey: "employeeId", as: "performances" })
Performance.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" })

User.hasMany(Performance, { foreignKey: "reviewerId", as: "reviewsGiven" })
Performance.belongsTo(User, { foreignKey: "reviewerId", as: "reviewer" })

module.exports = {
  sequelize,
  User,
  Employee,
  Attendance,
  JobSite,
  Schedule,
  Performance,
}
