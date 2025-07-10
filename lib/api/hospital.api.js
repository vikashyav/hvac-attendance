import { withConfig, getApi } from "./index";
const api = getApi("hospital");


export const getHospitalMasterList = withConfig((data, conf) => {
    const { username, password, ...payload } = data;
    const config = conf({
      url: "/",
      method: "GET",
      data: payload,
    });
    return api(config);
  });