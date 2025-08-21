import axios from "axios";
import constants from "../../constants";
import { withConfig, getApi } from "./index";
const api = getApi("leave-request");

export const createLeaveRequest = withConfig((data, conf) => {
  const {  ...payload } = data;
  const config = conf({
    url: "/",
    method: "POST",
    data: payload,
  });
  return api(config);
});

export const updateLeaveRequest = withConfig((data, conf) => {
  const {  id, ...payload } = data;
  const config = conf({
    url: `/${id}`,
    method: "PUT",
    data: payload,
  });
  return api(config);
});

export const updateLeaveStatus = withConfig((data, conf) => {
  const {  id, ...payload } = data;
  const config = conf({
    url: `/${id}/admin`,
    method: "PUT",
    data: payload,
  });
  return api(config);
});

export const getLeaveRequest = withConfig((data, conf) => {
  const {  ...payload } = data;
  const config = conf({
    url: "/",
    method: "GET",
    data: payload,
  });
  return api(config);
});
