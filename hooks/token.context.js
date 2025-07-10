import React, { useContext, useCallback, createContext, useEffect, useMemo, useState } from "react";

import storageService from "../lib/services/storage.service";
import Const from "../constants";
import is from "../utils/is";

const TokenContext = createContext();

export function TokenProvider(props) {
  const { children } = props;
  const [data, setData] = useState(() => {
    let tokens = storageService.getItem(Const.CONTEXT_TYPE.TOKEN);
    return tokens || {};
  });

  const setToken = useCallback((tokenType, tokenData) => {
    let tokens = storageService.getItem(Const.CONTEXT_TYPE.TOKEN) || {};
    tokens[tokenType] = tokenData;
    storageService.setItem(Const.CONTEXT_TYPE.TOKEN, tokens);
    setData(tokens);
  }, []);

  const clearTokens = useCallback(() => {
    storageService.clear(Const.CONTEXT_TYPE.TOKEN);
    setData({});
  }, []);

  const syncToSession = useCallback(() => {
    syncLocalTokensToSession();
  }, []);

  useEffect(() => {
    function subscribeHandler(tokens) {
      setData(tokens);
    }
    storageService.addChangeListener(Const.CONTEXT_TYPE.TOKEN, subscribeHandler);
    return () => {
      storageService.removeChangeListener(Const.CONTEXT_TYPE.TOKEN, subscribeHandler);
    };
  }, []);

  const value = useMemo(() => {
    return { tokens: data, setToken, clearTokens, syncToSession };
  }, [clearTokens, data, setToken, syncToSession]);

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}

export function useTokensFromStorage() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useTokensFromStorage must be used within a TokenProvider");
  }
  return context;
}

// NOTE: only and only use this functions when needed to use outside react
export function getTokenDataFromStorage(tokenType) {
  let tokens = storageService.getItem(Const.CONTEXT_TYPE.TOKEN);
  return tokens?.[tokenType];
}
export function setTokenDataToStorage(tokenType, tokenData) {
  let tokens = storageService.getItem(Const.CONTEXT_TYPE.TOKEN) || {};
  tokens[tokenType] = tokenData;
  storageService.setItem(Const.CONTEXT_TYPE.TOKEN, tokens);
}
export function clearTokenDataFromStorage() {
  // storageService.removeItem(Const.CONTEXT_TYPE.TOKEN);
  storageService.clear();
  // storageService.clear()
}

// Note: this methods use sessionStorage API, DO NOT USE IT
// use storageService instead.
export function getTokenDataFromSession(tokenType) {
  let val = sessionStorage.getItem(Const.CONTEXT_TYPE.TOKEN);
  if (is.null(val) || is.undefined(val)) return val;
  let tokens = JSON.parse(window.atob(val));
  return tokens?.[tokenType];
}
export function setTokenDataToSession(tokenType, tokenData) {
  let val = sessionStorage.getItem(Const.CONTEXT_TYPE.TOKEN);
  let tokens = val ? JSON.parse(window.atob(val)) : {};
  tokens[tokenType] = tokenData;
  sessionStorage.setItem(Const.CONTEXT_TYPE.TOKEN, window.btoa(JSON.stringify(tokens)));
}
export function clearTokenDataFromSession() {
  sessionStorage.removeItem(Const.CONTEXT_TYPE.TOKEN);
}

export function syncLocalTokensToSession() {
  let tokens = localStorage.getItem(Const.CONTEXT_TYPE.TOKEN);
  if (!is.null(tokens)) {
    sessionStorage.setItem(Const.CONTEXT_TYPE.TOKEN, tokens);
  }
}

export default TokenProvider;
