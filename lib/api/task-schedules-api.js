import axios from "axios";
import constants from "../../constants";
import { withConfig, getApi } from "./index";
const api = getApi("schedule_tasks-manage");

export const TaskSchedulesRegistration = withConfig((data, conf) => {
  const {  ...payload } = data;
  const config = conf({
    url: "/",
    method: "POST",
    data: payload,
  });
  return api(config);
});

export const TaskSchedulesUpdate = withConfig((data, conf) => {
  const { id, ...payload } = data;
  console.log("data", data);
  
  const config = conf({
    url: `/${id}`,
    method: "PUT",
    data: payload,
  });
  return api(config);
});

export const getTaskSchedulesList = withConfig((data, conf) => {
  const {  ...payload } = data;
  const config = conf({
    url: "/",
    method: "GET",
    params: payload,
  });
  return api(config);
});
