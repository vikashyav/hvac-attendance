// import axios from "axios";
// import constants from "../constants";
import { withConfig, getApi } from "./index";
const api = getApi("certificate");


export const getCertificateList = withConfig((data, conf) => {
    const { username, password, ...payload } = data;
    const config = conf({
      url: "/",
      method: "GET",
      data: payload,
    });
    return api(config);
  });

  export const saveCertificateDetails = withConfig((data, conf) => {
    const { ...payload } = data;
    const config = conf({
      url: "/",
      method: "POST",
      data: payload,
    });
    return api(config);
  });

  export const updateCertificateDetails = withConfig((data, conf) => {
    const { certificate_id, ...payload } = data;
    const config = conf({
      url: `/${certificate_id}`,
      method: "PUT",
      data: payload,
    });
    return api(config);
  });
  
  // /:certificate_id/generate-digital-certificate
  export const generateCertificate = withConfig((data, conf) => {
    const {certificate_id, ...payload } = data;
    const config = conf({
      url: `/${certificate_id}/generate-digital-certificate`,
      method: "PUT",
      data: payload,
    });
    return api(config);
  });
  
  export const deleteCertificateById = withConfig((data, conf) => {
    const {certificate_id, ...payload } = data;
    const config = conf({
      url: `/${certificate_id}/delete`,
      method: "DELETE",
      data: payload,
    });
    return api(config);
  });
  