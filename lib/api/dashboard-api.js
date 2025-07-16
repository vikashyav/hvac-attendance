import axios from "axios";
import constants from "../../constants";
import { withConfig, getApi } from "./index";
const api = getApi("dashboard");


export const getAdminDashboardStats = withConfig((data, conf) => {
  const { queryKey, ...payload } = data;
  // console.log(queryKey);
  
  const config = conf({
    url: "/admin",
    method: "GET",
    params: queryKey,
  });
  return api(config);
});