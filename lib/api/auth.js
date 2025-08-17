import axios from "axios";
import constants from "../../constants";
import { withConfig, getApi } from "./index";
const api = getApi("user");

// export function userLogin (data){
//     return axios.post(`${constants.HVAC_PRO_API}/user/login`, data);
// }

export const userLogin = withConfig((data, conf) => {
    const { username, password, ...payload } = data;
    const config = conf({
      url: "/login",
      method: "POST",
      auth: {
        username,
        password,
      },
      data: payload,
    });
    return api(config);
  });

  export const userlist= withConfig((data, conf)=>{
    const config= conf({
      url:"list",
      method:"GET",
    })
    return api(config);
  })


export const userRegistration = withConfig((data, conf) => {
  const {  ...payload } = data;
  const config = conf({
    url: "/register",
    method: "POST",
    data: payload,
  });
  return api(config);
});

export const employeeRegistration = withConfig((data, conf) => {
  const {  ...payload } = data;
  const config = conf({
    url: "/employees",
    method: "POST",
    data: payload,
  });
  return api(config);
});

export const updateUser = withConfig((data, conf) => {
  const {user_id,  ...payload } = data;
  const config = conf({
    url: `/register/${user_id}`,
    method: "PUT",
    data: payload,
  });
  return api(config);
});

export const changePassword = withConfig((data, conf) => {
    const { username, password, ...payload } = data;
    const config = conf({
      url: "/change-password",
      method: "POST",
      // auth: {
      //   username,
      //   password,
      // },
      data: payload,
    });
    return api(config);
  });