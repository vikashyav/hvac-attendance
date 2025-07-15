import axios from "axios";
import constants from "../../constants";
import { withConfig, getApi } from "./index";
const api = getApi("attendance");


export const getAttendance = withConfig((data, conf) => {
  const { queryKey, ...payload } = data;
  // console.log(queryKey);
  
  const config = conf({
    url: "/",
    method: "GET",
    params: queryKey,
  });
  return api(config);
});