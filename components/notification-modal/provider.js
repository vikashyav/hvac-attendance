"use client"
import { useCallback, useMemo, useReducer } from "react"
// import useKeyPress from "../../hooks/use-key-press"
import Const from "../../constants"
import generateContext from "../../utils/generate-context"

const initialState = { type: "", heading: "", body: "", open: false }

const reducer = (state, action) => {

  switch (action.type) {
    case Const.NOTIFICATION_TYPE.SUCCESS:
    case Const.NOTIFICATION_TYPE.ERROR:
    case Const.NOTIFICATION_TYPE.INFO:
    case Const.NOTIFICATION_TYPE.PROGRESS:
    case Const.NOTIFICATION_TYPE.WARNING:
    case Const.NOTIFICATION_TYPE.CONFIRM: {

      return {
        type: action.type,
        ...action.payload,
        open: true,
      }
    }
    case Const.NOTIFICATION_TYPE.CLOSE: {
      return {
        ...initialState,
      }
    }
    default: {
      return state
    }
  }
}

function useNotificationModal(props) {
  const [notificationModal, dispatch] = useReducer(reducer, initialState)

  const success = payload => {
    dispatch({ type: Const.NOTIFICATION_TYPE.SUCCESS, payload })
  }

  const error = payload => {
    dispatch({ type: Const.NOTIFICATION_TYPE.ERROR, payload })
  }

  const info = payload => {
    dispatch({ type: Const.NOTIFICATION_TYPE.INFO, payload })
  }

  const progress = payload => {
    dispatch({ type: Const.NOTIFICATION_TYPE.PROGRESS, payload })
  }

  const warning = payload => {
    dispatch({ type: Const.NOTIFICATION_TYPE.WARNING, payload })
  }

  const close = () => {
    dispatch({ type: Const.NOTIFICATION_TYPE.CLOSE })
  }

  let {
    closeOnEscape = false,
    closeOnConfirm = true,
    closeOnCancel = true,
    closeOnOverlay = false,
    confirmText,
    cancelText = "No",
    closeText = "Close",
    classNames = {},
    ...restProps
  } = notificationModal
  if (!confirmText) {
    if (notificationModal.type === Const.NOTIFICATION_TYPE.SUCCESS) {
      confirmText = "Close"
    } else {
      confirmText = "Yes"
    }
  }

  // useKeyPress(document, "Escape", () => {
  //   if (!notificationModal.open) return
  //   closeOnEscape && close()
  //   notificationModal.onEscapeClick && notificationModal.onEscapeClick()
  // })

  const onConfirm = useCallback(() => {
    closeOnConfirm && close()
    notificationModal.onConfirm && notificationModal.onConfirm()
  }, [closeOnConfirm, notificationModal])

  const onCancel = useCallback(() => {
    closeOnCancel && close()
    notificationModal.onCancel && notificationModal.onCancel()
  }, [closeOnCancel, notificationModal])

  const onClose = useCallback(() => {
    close()
    notificationModal.onClose && notificationModal.onClose()
  }, [notificationModal])

  const handleOverlayClick = useCallback(() => {
    closeOnOverlay && close()
    notificationModal.onOverlayClick && notificationModal.onOverlayClick()
  }, [closeOnOverlay, notificationModal])

  const showConfirmCTA = !!notificationModal.onConfirm

  const showCancelCTA = useMemo(() => {
    if (showConfirmCTA) {
      if (notificationModal.type === Const.NOTIFICATION_TYPE.SUCCESS) {
        return false
      }
      return true
    }
  }, [notificationModal.type, showConfirmCTA])

  const showCloseCTA = useMemo(() => {
    if (notificationModal.hideCloseBtn) {
      return false
    }
    if (notificationModal.type === Const.NOTIFICATION_TYPE.PROGRESS) {
      return false
    }
    return !showConfirmCTA
  }, [notificationModal.hideCloseBtn, notificationModal.type, showConfirmCTA])

  return useMemo(() => {
    return {
      ...restProps,

      success,
      error,
      info,
      warning,
      progress,
      close,

      confirmText,
      cancelText,
      closeText,

      closeOnEscape,
      closeOnConfirm,
      closeOnCancel,
      closeOnOverlay,

      onCancel,
      onClose,
      handleOverlayClick,
      onConfirm,

      showConfirmCTA,
      showCancelCTA,
      showCloseCTA,

      classNames,
    }
  }, [
    restProps,
    confirmText,
    cancelText,
    closeText,
    closeOnEscape,
    closeOnConfirm,
    closeOnCancel,
    closeOnOverlay,
    onCancel,
    onClose,
    handleOverlayClick,
    onConfirm,
    showConfirmCTA,
    showCancelCTA,
    showCloseCTA,
    classNames,
  ])
}

export const [NotificationModalProvider, useNotificationModalContext] =
  generateContext(useNotificationModal)
