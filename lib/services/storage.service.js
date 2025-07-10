"use client"
import React from "react"
import is from "../../utils/is";

class LocalStorage {
  _getItem = (keyName) =>{
      if (typeof window === 'undefined') return {};
      try {
        let val = localStorage.getItem(keyName);
      if (is.null(val) || is.undefined(val)) return val;
      return JSON.parse(window.atob(val));
      } catch (err) {
        return {};
      }
    }
  //   {
  //   let val = localStorage.getItem(keyName);
  //   if (is.null(val) || is.undefined(val)) return val;
  //   return JSON.parse(window.atob(val));
  // };
  _setItem = (keyName, keyValue) => {
    console.log("setting data to local...");
    return localStorage.setItem(keyName, window.btoa(JSON.stringify(keyValue)));
  };
  _removeItem = (keyName) => {
    localStorage.removeItem(keyName);
  };
  _clear = () => {
    localStorage.clear();
  };
}

class Storage extends LocalStorage {
  subscribers = {};

  /**
   *
   * @param {string} keyName
   * @returns
   */
  getItem = (keyName) => {
    return this._getItem(keyName);
  };

  /**
   *
   * @param {string} keyName
   * @param {*} keyValue
   * @returns
   */
  setItem = (keyName, keyValue) => {
    if (is.undefined(keyName)) {
      throw new Error("keyName should not be undefined");
    }
    this._setItem(keyName, keyValue);
    this.emit(keyName);
  };

  /**
   *
   * @param {string} keyName
   */
  removeItem = (keyName) => {
    if (is.undefined(keyName)) {
      //Do nothing
    } else {
      this._removeItem(keyName);
      this.emit(keyName);
    }
  };

  clear = () => {
    this._clear();
  };

  /**
   *
   * @param {string} keyName
   */
  emit = (keyName) => {
    let subscribers = this.subscribers[keyName] || [];
    subscribers.forEach((subscriber) => {
      let value = this._getItem(keyName);
      subscriber(value);
    });
  };

  /**
   *
   * @param {string} keyName
   * @param {function} cb
   */
  addChangeListener = (keyName, cb) => {
    if (this.subscribers[keyName]) {
      this.subscribers[keyName].push(cb);
    } else {
      this.subscribers[keyName] = [cb];
    }
  };

  /**
   *
   * @param {string} keyName
   * @param {function} cb
   */
  removeChangeListener = (keyName, cb) => {
    this.subscribers[keyName] = this.subscribers[keyName].filter((callBack) => cb !== callBack);
  };
}
const storage = new Storage();
export default storage;
