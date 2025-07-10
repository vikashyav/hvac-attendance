"use client"
import { useReducer, useCallback, useMemo } from 'react';
import Const from "../../constants";
import generateContext from '../../utils/generate-context';

const initialState = { type: "", heading: "", body: "", initialValue:{}, validationSchema:{},  open: false };

const reducer = (state, action) => {
  switch (action.type) {
    case Const.NOTIFICATION_TYPE.WARNING:
    case Const.NOTIFICATION_TYPE.CONFIRM: {
      return {
        type: action.type,
        ...action.payload,
        open: true,
      };
    }
    case Const.NOTIFICATION_TYPE.CLOSE: {
      return {
        ...initialState,
      };
    }
    default: {
      return state;
    }
  }
};

export const useConfirmationModalContext = ({ children }) => {
    const [notificationModal, dispatch] = useReducer(reducer, initialState);
  const warning = (payload) => {
    dispatch({ type: Const.NOTIFICATION_TYPE.WARNING, payload });
  };

  const close = () => {
    dispatch({ type: Const.NOTIFICATION_TYPE.CLOSE });
  };

  const onConfirm = useCallback((event) => {
    close();
    notificationModal.onConfirm && notificationModal.onConfirm(event);
  }, [notificationModal]);

  let {
    confirmText= "Yes",
    cancelText = "No",
    closeText = "Close",
    ...restProps
  } = notificationModal;

  return useMemo(() => {
    return {
      ...restProps,
      warning,
      close,
      onConfirm,

      confirmText,
      cancelText,
      closeText,
    }
  },[cancelText, closeText, confirmText, onConfirm, restProps])

};

export const [ConfirmationModalProvider, useConfirmationModal] =
  generateContext(useConfirmationModalContext);