const { DataTypes } = require("sequelize")
const sequelize = require("../config")

const Schedule = sequelize.define("Schedule", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Employee",
      key: "id",
    },
  },
  jobSiteId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "JobSite",
      key: "id",
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  taskDescription: {
    type: DataTypes.TEXT,
  },
  priority: {
    type: DataTypes.ENUM("low", "medium", "high", "urgent"),
    defaultValue: "medium",
  },
  status: {
    type: DataTypes.ENUM("scheduled", "in_progress", "completed", "cancelled"),
    defaultValue: "scheduled",
  },
  estimatedHours: {
    type: DataTypes.DECIMAL(4, 2),
  },
  actualHours: {
    type: DataTypes.DECIMAL(4, 2),
  },
  requiredSkills: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  tools: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  materials: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  notes: {
    type: DataTypes.TEXT,
  },
  completedAt: {
    type: DataTypes.DATE,
  },
})

module.exports = Schedule
