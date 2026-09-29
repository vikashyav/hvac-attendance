import axios from "axios";
import constants from "../../constants";
import { withConfig, getApi } from "./index";
const api = getApi("attendance");


export const getAttendance = withConfig((data, conf) => {
  const { queryKey, ...payload } = data;
  const params = Array.isArray(queryKey) ? queryKey[queryKey.length - 1] : queryKey;
  const config = conf({
    url: "/",
    method: "GET",
    params,
  });
  return api(config);
});