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

export const getEmployeeDashboardStats = withConfig((data, conf) => {
  const { queryKey, ...payload } = data;
  // console.log(queryKey);
  
  const config = conf({
    url: "/employee",
    method: "GET",
    params: queryKey,
  });
  return api(config);
});

export const downloadReports = withConfig((data, conf) => {
  const { queryKey, ...payload } = data;
  const config = conf({
    url: `/generate-report`,
    method: "GET",
    params: queryKey,
    responseType: "blob",
  });

  return api(config);
});

export const saveSubscrption = withConfig((data, conf) => {
  const { queryKey, ...payload } = data;
  const config = conf({
    url: `/save-notification-subscription`,
    method: "POST",
    params: queryKey,
    data: payload,
  });

  return api(config);
});

export const deleteSubscrption = withConfig((data, conf) => {
  const { queryKey, ...payload } = data;
  const config = conf({
    url: `/delete-subscription`,
    method: "DELETE",
    params: queryKey,
    data: payload,
  });

  return api(config);
});