"use client"
import axios from "axios";
import deepMergeObjects from "@/utils/deep-merge-objects";
import Const from "../../constants";
import { clearTokenDataFromStorage, getTokenDataFromStorage } from "../../hooks/token.context";
import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from 'next/navigation'
import { useNotificationModalContext } from "@/components/notification-modal/provider";

const mainInstance = axios.create({
    headers: { "Content-Type": "application/json" },
    baseURL: `${Const.HVAC_PRO_API}`,
  });
  
  export default mainInstance;
  
  export function withConfig(fn) {
    return (data) => {
      let { signal, ...restData } = data;
      const configure = (config) => {
        let defaultConfig = {};
        if (signal) {
          defaultConfig.signal = signal;
        }
        return deepMergeObjects(defaultConfig, config);
      };
      return fn(restData, configure);
    };
  }
  
  export function getApi(routeGroup = "") {
    return (config) => {
      let { url, ...restConfig } = config;
      let updatedUrl = url;
      if (routeGroup) {
        updatedUrl = `/${routeGroup}/${url}`.replaceAll("//", "/");
      }
      return mainInstance({
        url: updatedUrl,
        ...restConfig,
      });
    };
  }

  export function AxiosInterceptorProvider(props) {
    const notificationModal = useNotificationModalContext()
  const router = useRouter();
    useEffect(() => {

      function handleError401(error) {
        return new Promise((resolve) => {
          notificationModal.error({
            title: "Unauthorized.",
            heading: "You will be redirected to the Login page. Please try logging in again.",
            onClose: () => {
              //__TODO__: need modification
              clearTokenDataFromStorage();
              router.push("/login");
              resolve();
            },
          });
        });
      }
  
      function handleError403(error) {
        return new Promise((resolve) => {
          if (error.response.data.error === "jwt expired" || error.response.data.error === "refresh-token expired") {
            notificationModal.error({
              title: "MESSAGES.SESSION_EXPIRED.TITLE",
              heading: "MESSAGES.SESSION_EXPIRED.HEADING",
              closeText: "Ok",
              onClose: () => {
                //__TODO__: need modification
                clearTokenDataFromStorage();
                router.push("/");
                resolve();
              },
            });
          } else {
            notificationModal.error({
              title: MESSAGES.ACCESS_DENIED.TITLE,
              heading: MESSAGES.ACCESS_DENIED.HEADING,
              closeText: "Ok",
              onClose: () => {
                //__TODO__: need modification
                clearTokenDataFromStorage();
                router.push("/");
                resolve();
              },
            });
          }
        });
      }

      function onBeforeResponseRecieve(response) {
        const { access_token, refresh_token } = response.data;
        if (access_token) {
          //__TODO__: need modification
          setTokenDataToStorage(Const.TOKEN_TYPE.ACCESS, access_token);
          setTokenDataToSession(Const.TOKEN_TYPE.ACCESS, access_token);
        }
        if (refresh_token) {
          //__TODO__: need modification
          setTokenDataToStorage(Const.TOKEN_TYPE.REFRESH, refresh_token);
          setTokenDataToSession(Const.TOKEN_TYPE.REFRESH, refresh_token);
        }
        return response;
      }
  

    function onBeforeRequestSent(config) {
      //__TODO__: need modification
      const accessToken = getTokenDataFromStorage(Const.TOKEN_TYPE.ACCESS);
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    }

    function onResponseError(instance) {
      return async (error) => {
        const originalConfig = error.config;

        if (!error.response) {
          return Promise.reject(error);
        }

        let is401 = error.response.status === 401; //unauthorized error
        let is403 = error.response.status === 403;
        let is5xx = error.response.status >= 500;
        let isGetMethod = error.response.config.method === "get";
        let isRefreshTokenExpired = is403 && error.response.data.error === "refresh-token expired";

        if (originalConfig._retry) {
          if (is401) {
          // return Promise.reject(error);
            return handleError401(error);
          }
          if (is403) {
            return handleError403(error);
          }
        } else {
          if (is401) {
          //  return Promise.reject(error);
            return handleError401(error);
          }
          if (is403) {
            return handleError403(error);
          }
          if (is5xx) {
            return isGetMethod ? Promise.reject(error) : handleError500(error);
          }
          if (isRefreshTokenExpired) {
            return handleError403(error);
          }
          if (!is401 && !is403) {
            return Promise.reject(error);
          }
        }
        originalConfig._retry = true;

        try {
          const localRefreshToken = getTokenDataFromStorage(Const.TOKEN_TYPE.REFRESH);
          if (!localRefreshToken) return Promise.reject(error);
          const rs = await getRefreshToken({
            refreshToken: localRefreshToken,
          });
          const { access_token, refresh_token } = rs.data;

          //__TODO__: need modification
          setTokenDataToStorage(Const.TOKEN_TYPE.ACCESS, access_token);
          setTokenDataToStorage(Const.TOKEN_TYPE.REFRESH, refresh_token);
          instance.defaults.headers.common[Const.TOKEN_TYPE.ACCESS] = access_token;
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      };
    }

    const requestInterceptor = mainInstance.interceptors.request.use(onBeforeRequestSent);
    const responseInterceptor = mainInstance.interceptors.response.use(onBeforeResponseRecieve, onResponseError(mainInstance));

    return () => {
      // cleanup function
      mainInstance.interceptors.request.eject(requestInterceptor);
      mainInstance.interceptors.response.eject(responseInterceptor);
    };
    },[notificationModal])
  return props.children;

  }
