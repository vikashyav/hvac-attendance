const { DataTypes } = require("sequelize")
const sequelize = require("../config")

const Performance = sequelize.define(
  "Performance",
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
    reviewerId: {
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "id",
      },
    },
    reviewPeriod: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "e.g., 2024-Q1, 2024-01, etc.",
    },
    attendanceScore: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 100,
      },
    },
    punctualityScore: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 100,
      },
    },
    productivityScore: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 100,
      },
    },
    qualityScore: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 100,
      },
    },
    safetyScore: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 100,
      },
    },
    overallRating: {
      type: DataTypes.DECIMAL(3, 2),
      validate: {
        min: 0,
        max: 5,
      },
    },
    goals: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    achievements: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    feedback: {
      type: DataTypes.TEXT,
    },
    improvementAreas: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    nextReviewDate: {
      type: DataTypes.DATE,
    },
  },
  {
    hooks: {
      beforeSave: (performance) => {
        const scores = [
          performance.attendanceScore,
          performance.punctualityScore,
          performance.productivityScore,
          performance.qualityScore,
          performance.safetyScore,
        ].filter((score) => score !== null && score !== undefined)

        if (scores.length > 0) {
          const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
          performance.overallRating = (average / 20).toFixed(2) // Convert to 5-point scale
        }
      },
    },
  },
)

module.exports = Performance
