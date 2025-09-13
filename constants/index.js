export default{
    HVAC_PRO_API:
    // "http://hvacexpert.shop/api/v1/",
    "https://hvacapi.osc-fr1.scalingo.io/api/v1",
    // "https://hvacapi-production.up.railway.app/api/v1/",
    // "https://hvac-api.onrender.com/api/v1",||
    // "https://birth-cert-api.onrender.com/v1",
    // "http://localhost:5000/api/v1/",
    CONTEXT_TYPE: {
        USER: "user",
        TOKEN: "token",
        USER_INFO:"userInfo",
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