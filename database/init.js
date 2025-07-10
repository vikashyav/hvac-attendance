const { sequelize } = require("./models")
const { seedDatabase } = require("./seeders")
// import {sequelize} from "./models"
// import {seeedDatabase} from "./seeders"
const initializeDatabase = async () => {
  try {
    // const {sequelize: sequelize_} = require("./config")
    console.log("Connecting to database...", process.env.SEED_DATABASE)
    await sequelize.authenticate()

    console.log("Database connection established successfully.")

    console.log("Synchronizing database models...")
    await sequelize.sync({ force: true }) // Use { force: true } to recreate tables
    console.log("Database models synchronized successfully.")

    if (process.env.SEED_DATABASE === "true") {
      console.log("Seeding database with initial data...")
      await seedDatabase()
    }

    console.log("Database initialization completed!")
  } catch (error) {
    console.error("Unable to initialize database:", error)
    process.exit(1)
  }
}

const resetDatabase = async () => {
  try {
    console.log("Resetting database...")
    await sequelize.drop()
    await sequelize.sync({ force: true })

    if (process.env.SEED_DATABASE === "true") {
      await seedDatabase()
    }

    console.log("Database reset completed!")
  } catch (error) {
    console.error("Error resetting database:", error)
    throw error
  }
}

module.exports = {
  initializeDatabase,
  resetDatabase,
}

// Run initialization if this file is executed directly
if (require.main === module) {
    console.log("Starting app...")
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
