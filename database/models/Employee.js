const { DataTypes } = require("sequelize")
const sequelize = require("../config")

const Employee = sequelize.define("Employee", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "User",
      key: "id",
    },
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hireDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(5, 2),
  },
  emergencyContact: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  address: {
    type: DataTypes.TEXT,
  },
  certifications: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  workSchedule: {
    type: DataTypes.JSON,
    defaultValue: {
      monday: { start: "08:00", end: "17:00" },
      tuesday: { start: "08:00", end: "17:00" },
      wednesday: { start: "08:00", end: "17:00" },
      thursday: { start: "08:00", end: "17:00" },
      friday: { start: "08:00", end: "17:00" },
      saturday: null,
      sunday: null,
    },
  },
  profileImage: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
})

module.exports = Employee
