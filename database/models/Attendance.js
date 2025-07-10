const { DataTypes } = require("sequelize")
const sequelize = require("../config")

const Attendance = sequelize.define(
  "Attendance",
  {
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
      references: {
        model: "JobSite",
        key: "id",
      },
    },
    checkInTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOutTime: {
      type: DataTypes.DATE,
    },
    checkInLocation: {
      type: DataTypes.JSON,
      validate: {
        hasLatLng(value) {
          if (value && (!value.latitude || !value.longitude)) {
            throw new Error("Location must have latitude and longitude")
          }
        },
      },
    },
    checkOutLocation: {
      type: DataTypes.JSON,
    },
    checkInPhoto: {
      type: DataTypes.STRING,
    },
    checkOutPhoto: {
      type: DataTypes.STRING,
    },
    workHours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    overtimeHours: {
      type: DataTypes.DECIMAL(4, 2),
      defaultValue: 0,
    },
    breakTimeMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("present", "late", "absent", "half_day"),
      defaultValue: "present",
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    hooks: {
      beforeSave: (attendance) => {
        if (attendance.checkInTime && attendance.checkOutTime) {
          const diffMs = attendance.checkOutTime - attendance.checkInTime
          const diffHours = diffMs / (1000 * 60 * 60)
          const breakHours = (attendance.breakTimeMinutes || 0) / 60
          const workHours = Math.max(0, diffHours - breakHours)

          attendance.workHours = workHours
          attendance.overtimeHours = Math.max(0, workHours - 8)
        }
      },
    },
  },
)

module.exports = Attendance
