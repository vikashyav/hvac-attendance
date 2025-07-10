const { User, Employee, JobSite, Schedule, Attendance, Performance } = require("../models")

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...")

    // Create admin user
    const adminUser = await User.create({
      email: "admin@hvacpro.com",
      password: "password",
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      phone: "+1234567890",
    })

    // Create employee users
    const employeeUsers = await User.bulkCreate([
      {
        email: "mike.johnson@hvacpro.com",
        password: "password",
        role: "employee",
        firstName: "Mike",
        lastName: "Johnson",
        phone: "+1234567891",
      },
      {
        email: "sarah.wilson@hvacpro.com",
        password: "password",
        role: "employee",
        firstName: "Sarah",
        lastName: "Wilson",
        phone: "+1234567892",
      },
      {
        email: "david.brown@hvacpro.com",
        password: "password",
        role: "employee",
        firstName: "David",
        lastName: "Brown",
        phone: "+1234567893",
      },
    ])

    // Create employee profiles
    const employees = await Employee.bulkCreate([
      {
        employeeId: "EMP001",
        userId: employeeUsers[0].id,
        department: "HVAC Technician",
        position: "Senior Technician",
        hireDate: new Date("2023-01-15"),
        hourlyRate: 28.5,
        address: "123 Main St, Springfield, IL 62701",
        certifications: ["EPA 608", "NATE", "HVAC Excellence"],
        skills: ["Installation", "Repair", "Maintenance", "Troubleshooting"],
        emergencyContact: {
          name: "Jane Johnson",
          relationship: "Spouse",
          phone: "+1234567894",
        },
      },
      {
        employeeId: "EMP002",
        userId: employeeUsers[1].id,
        department: "HVAC Technician",
        position: "Technician",
        hireDate: new Date("2023-03-20"),
        hourlyRate: 24.0,
        address: "456 Oak Ave, Springfield, IL 62702",
        certifications: ["EPA 608", "OSHA 10"],
        skills: ["Installation", "Maintenance", "Customer Service"],
        emergencyContact: {
          name: "Robert Wilson",
          relationship: "Father",
          phone: "+1234567895",
        },
      },
      {
        employeeId: "EMP003",
        userId: employeeUsers[2].id,
        department: "HVAC Technician",
        position: "Apprentice",
        hireDate: new Date("2023-06-01"),
        hourlyRate: 18.0,
        address: "789 Pine St, Springfield, IL 62703",
        certifications: ["OSHA 10"],
        skills: ["Basic Installation", "Tool Maintenance"],
        emergencyContact: {
          name: "Mary Brown",
          relationship: "Mother",
          phone: "+1234567896",
        },
      },
    ])

    // Create job sites
    const jobSites = await JobSite.bulkCreate([
      {
        name: "Springfield Mall",
        address: "2501 Wabash Ave, Springfield, IL 62704",
        coordinates: {
          latitude: 39.7817,
          longitude: -89.6501,
        },
        radius: 150,
        clientName: "Springfield Mall Management",
        clientContact: {
          name: "John Manager",
          phone: "+1234567897",
          email: "john@springfieldmall.com",
        },
        projectType: "HVAC Installation",
        status: "active",
        startDate: new Date("2024-01-01"),
        estimatedHours: 200,
        budget: 50000.0,
        description: "Complete HVAC system installation for new wing",
        requirements: ["EPA 608 Certification", "Commercial Experience"],
        safetyNotes: "Hard hat and safety vest required at all times",
      },
      {
        name: "Downtown Office Building",
        address: "100 N 7th St, Springfield, IL 62701",
        coordinates: {
          latitude: 39.8014,
          longitude: -89.6445,
        },
        radius: 100,
        clientName: "Downtown Properties LLC",
        clientContact: {
          name: "Susan Property",
          phone: "+1234567898",
          email: "susan@downtownproperties.com",
        },
        projectType: "Maintenance Contract",
        status: "active",
        startDate: new Date("2024-01-15"),
        estimatedHours: 40,
        budget: 8000.0,
        description: "Monthly maintenance for office building HVAC systems",
        requirements: ["NATE Certification"],
        safetyNotes: "Building access card required",
      },
    ])

    // Create schedules
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    await Schedule.bulkCreate([
      {
        employeeId: employees[0].id,
        jobSiteId: jobSites[0].id,
        date: today.toISOString().split("T")[0],
        startTime: "08:00:00",
        endTime: "17:00:00",
        taskDescription: "Install main HVAC unit in food court area",
        priority: "high",
        status: "in_progress",
        estimatedHours: 8,
        requiredSkills: ["Installation", "Commercial HVAC"],
        tools: ["Drill", "Level", "Multimeter"],
        materials: ["HVAC Unit", "Ductwork", "Electrical Components"],
      },
      {
        employeeId: employees[1].id,
        jobSiteId: jobSites[1].id,
        date: today.toISOString().split("T")[0],
        startTime: "09:00:00",
        endTime: "15:00:00",
        taskDescription: "Routine maintenance check on floors 1-3",
        priority: "medium",
        status: "scheduled",
        estimatedHours: 6,
        requiredSkills: ["Maintenance", "Troubleshooting"],
        tools: ["Basic Tool Kit", "Cleaning Supplies"],
        materials: ["Filters", "Lubricants"],
      },
    ])

    // Create attendance records
    const checkInTime = new Date()
    checkInTime.setHours(8, 15, 0, 0)

    await Attendance.bulkCreate([
      {
        employeeId: employees[0].id,
        jobSiteId: jobSites[0].id,
        checkInTime: checkInTime,
        checkInLocation: {
          latitude: 39.7817,
          longitude: -89.6501,
          address: "Springfield Mall",
        },
        status: "present",
        checkInPhoto: "checkin_mike_20240115.jpg",
      },
      {
        employeeId: employees[1].id,
        jobSiteId: jobSites[1].id,
        checkInTime: new Date(checkInTime.getTime() + 30 * 60000), // 30 minutes later
        checkInLocation: {
          latitude: 39.8014,
          longitude: -89.6445,
          address: "Downtown Office Building",
        },
        status: "late",
        checkInPhoto: "checkin_sarah_20240115.jpg",
      },
    ])

    // Create performance records
    await Performance.bulkCreate([
      {
        employeeId: employees[0].id,
        reviewerId: adminUser.id,
        reviewPeriod: "2024-Q1",
        attendanceScore: 95,
        punctualityScore: 88,
        productivityScore: 92,
        qualityScore: 96,
        safetyScore: 94,
        goals: ["Improve punctuality to 95%", "Complete advanced HVAC certification", "Mentor new apprentices"],
        achievements: [
          "Zero safety incidents",
          "Customer satisfaction rating 4.8/5",
          "Completed 15 installations ahead of schedule",
        ],
        feedback: "Excellent technical skills and work quality. Focus on improving arrival times.",
        improvementAreas: ["Time Management", "Documentation"],
        nextReviewDate: new Date("2024-07-01"),
      },
      {
        employeeId: employees[1].id,
        reviewerId: adminUser.id,
        reviewPeriod: "2024-Q1",
        attendanceScore: 92,
        punctualityScore: 85,
        productivityScore: 88,
        qualityScore: 90,
        safetyScore: 96,
        goals: ["Obtain NATE certification", "Improve customer communication skills", "Reduce material waste by 10%"],
        achievements: ["Perfect safety record", "Completed EPA 608 certification", "Positive customer feedback"],
        feedback: "Solid performer with great potential. Continue developing technical skills.",
        improvementAreas: ["Advanced Troubleshooting", "Leadership Skills"],
        nextReviewDate: new Date("2024-07-01"),
      },
    ])

    console.log("Database seeding completed successfully!")
    console.log("Created:")
    console.log("- 1 Admin user")
    console.log("- 3 Employee users")
    console.log("- 3 Employee profiles")
    console.log("- 2 Job sites")
    console.log("- 2 Schedule entries")
    console.log("- 2 Attendance records")
    console.log("- 2 Performance reviews")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

module.exports = { seedDatabase }
