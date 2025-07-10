const { DataTypes } = require("sequelize")
const sequelize = require("../config")

const JobSite = sequelize.define("JobSite", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  coordinates: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      hasLatLng(value) {
        if (!value.latitude || !value.longitude) {
          throw new Error("Coordinates must have latitude and longitude")
        }
      },
    },
  },
  radius: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    comment: "Check-in radius in meters",
  },
  clientName: {
    type: DataTypes.STRING,
  },
  clientContact: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  projectType: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM("active", "completed", "on_hold", "cancelled"),
    defaultValue: "active",
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
  estimatedHours: {
    type: DataTypes.INTEGER,
  },
  actualHours: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0,
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
  },
  description: {
    type: DataTypes.TEXT,
  },
  requirements: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  safetyNotes: {
    type: DataTypes.TEXT,
  },
})

module.exports = JobSite
