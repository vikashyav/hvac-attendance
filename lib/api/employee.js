import axios from "axios";
import constants from "../../constants";
import { withConfig, getApi } from "./index";
const api = getApi("employees");

export const employeeRegistration = withConfig((data, conf) => {
  const {  ...payload } = data;
  const config = conf({
    url: "/",
    method: "POST",
    data: payload,
  });
  return api(config);
});

export const employeeUpdate = withConfig((data, conf) => {
  const { id, ...payload } = data;
  console.log("data", data);
  
  const config = conf({
    url: `/${id}`,
    method: "PUT",
    data: payload,
  });
  return api(config);
});

export const getEmployeeList = withConfig((data, conf) => {
  const {  ...payload } = data;
  const config = conf({
    url: "/",
    method: "GET",
    params: payload,
  });
  return api(config);
});

export const saveCheckIn = withConfig((data, conf) => {
  const {  ...payload } = data;
  const config = conf({
    url: "/check_in",
    method: "POST",
    data: payload,
  });
  return api(config);
});

export const updateCheckOut = withConfig((data, conf) => {
  const {  check_in_id, ...payload} = data;
  const config = conf({
    url: `/check_in/${check_in_id}`,
    method: "PUT",
    data: payload,
  });
  return api(config);
});

export const getTodayCheckIn = withConfig((data, conf) => {
  const { queryKey, ...payload } = data;
  // console.log(queryKey);
  
  const config = conf({
    url: "/check_in/today",
    method: "GET",
    params: queryKey,
  });
  return api(config);
});