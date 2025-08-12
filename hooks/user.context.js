"use client"
import React, { useContext, createContext, useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation"

import storageService from "../lib/services/storage.service";

import Const from "../constants";
import is from "@/utils/is";

const UserContext = createContext();

export function UserProvider(props) {
  const { children } = props;
  const router = useRouter()

  // const  _getItem = (keyName) =>{
  //   if (typeof window === 'undefined') return {};
  //   try {
  //     let val = localStorage.getItem(keyName);
  //   if (is.null(val) || is.undefined(val)) return val;
  //   return JSON.parse(window.atob(val));
  //   } catch (err) {
  //     return {};
  //   }
  // } 

  const [data, setData] = useState(() => {
    return storageService.getItem(Const.CONTEXT_TYPE.USER) || {};//storageService.getItem(Const.CONTEXT_TYPE.USER) || {};
  });
  // console.log(data);

  const formattedData = useMemo(() => {
    if (Object.keys(data || {}).length <= 0) return {};
    return {
      ...data,
      isSuperAdmin: data.role === Const.ACCESS.SUPER_ADMIN,//data.access[Const.ACCESS.ADMIN],
      isAdmin: data.role === Const.ACCESS.ADMIN//data.access[Const.ACCESS.ADMIN],
    };
  }, [data]);

  const setUser = (user) => {
    storageService.setItem(Const.CONTEXT_TYPE.USER, user);
  };

  const removeUser = () => {
    storageService.removeItem(Const.CONTEXT_TYPE.USER);
  };

  const checkAccess = useCallback(
    (_accessToCheck, { all = false } = {}) => {
      let access = Object?.keys(data?.access || {}).reduce((prev, key) => {
        if (data.access[key]) {
          prev = [...prev, key];
        }
        return prev;
      }, []);

      let matched = access.filter((a) => _accessToCheck.includes(a || Const.ACCESS.ADMIN));
      let _isHadAccess;
      if (all) {
        _isHadAccess = matched?.length === _accessToCheck.length;
      } else {
        _isHadAccess = matched?.length > 0;
      }

      return _isHadAccess;
    },
    [data?.access]
  );

  useEffect(() => {
    function subscribeHandler(user) {
      setData(user);
    }
    storageService.addChangeListener(Const.CONTEXT_TYPE.USER, subscribeHandler);
    return () => {
      storageService.removeChangeListener(Const.CONTEXT_TYPE.USER, subscribeHandler);
    };
  }, []);

  const handleLogout = () => {
    storageService.clear();
    removeUser();
    document.cookie = 'access_token=; path=/; max-age=0';
    document.cookie = 'userInfo=; path=/; max-age=0';
    router.push("/login")
  }

  const setCookies = (name, value, days = 30) => {
    const encryptVal = encodeURIComponent(JSON.stringify(value)) //window.btoa(JSON.stringify(keyValue))
    const maxAge = days * 24 * 60 * 60; // Convert days to seconds
    document.cookie = `${name}=${encryptVal}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }

  const getCookies = (name) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(row => row.startsWith(name + '='));
    const val= decodeURIComponent(cookie.split('=')[1]);
          if (is.null(val) || is.undefined(val)|| val=='undefined') return "";
  return JSON.parse(val||'{}')
    // return cookie ? decodeURIComponent(cookie.split('=')[1]) : null; //decodeURIComponent(cookie.split('=')[1])
  }

  const value = useMemo(() => {
    return { user: formattedData, setUser, removeUser, checkAccess, handleLogout, setCookies, getCookies };
  }, [checkAccess, formattedData]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserFromStorage() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserFromStorage must be used within a UserProvider");
  }
  return context;
}

// NOTE: only and only use this functions when needed to use outside react
export function getUserFromStorage() {
  return storageService.getItem(Const.CONTEXT_TYPE.USER);
}

export default UserProvider;
