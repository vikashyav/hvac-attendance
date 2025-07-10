export default{
    HVAC_PRO_API:
    "https://hvacapi-production.up.railway.app/api/v1/",
    // "https://birth-cert-api.vercel.app/v1" ||
    // "https://birth-cert-api.onrender.com/v1",
    // "http://localhost:5000/api/v1/",
    CONTEXT_TYPE: {
        USER: "user",
        TOKEN: "token",
      },
      TOKEN_TYPE: {
        ACCESS: "access_token",
        REFRESH: "refresh_token",
      },
      ACCESS: {
        SUPER_ADMIN:"superAdmin",
        ADMIN:"admin",
        USER:"user"
      },
      NOTIFICATION_TYPE: {
        SUCCESS: "success",
        ERROR: "error",
        INFO: "info",
        WARNING: "warning",
        PROGRESS: "progress",
        CLOSE: "close",
        CONFIRM: "confirm",
      },
      // ["submited", "save", "pending", "approved"]
      CERT_STATUS:{
        SUBMITED: "submited",
        SAVE: "save",
        PENDING :"pending",
        APPROVED : "approved"
      }
}