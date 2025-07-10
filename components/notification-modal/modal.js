"use client"

import React from "react"
import cx from "../../utils/cx"
import { useNotificationModalContext } from "./provider"
import NotificationIcon from "./notification-icon"
// import { Button } from ""
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


function Modal(props) {
  const { children } = props;

  const notificationModal = useNotificationModalContext();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "notification-modal w-full min-h-[256px] bg-white mt-auto translate-y-full shadow-md flex items-center justify-center flex-col transition-transform overflow-hidden rounded-t-[100px]",
        notificationModal.open && "translate-y-0"
      )}
    >
      {children}
    </div>
  );
}


export function ModalBody() {
  const { type, title, heading, body, classNames = {} } = useNotificationModalContext();

  return (
    <div className="notification-modal_body w-fit flex items-center flex-col px-4 max-w-[50%]">
      <NotificationIcon type={type} />
      {title ? <p className="font-semibold my-2 font-inter text-2xl">{title}</p> : null}
      {heading ? <p className={cx("whitespace-nowrap", title && "lowercase first-letter:capitalize", classNames?.heading)}>{heading}</p> : null}
      {body ? <p className={cx("text-xs text-secondary-700 mt-3", classNames?.body)}>{body}</p> : null}
    </div>
  );
}

export function ModalFooter() {
  const { confirmText, cancelText, closeText, onConfirm, onCancel, onClose, classNames, showConfirmCTA, showCancelCTA, showCloseCTA } =
    useNotificationModalContext();

  return (
    <div className={cx("notification-modal_footer mt-[20px]", classNames?.footer)}>
      {showConfirmCTA ? (
        <>
          <Button onClick={onConfirm} color="primary" className={cx(showCancelCTA && "ml-5")}>
            {confirmText}
          </Button>
          {showCancelCTA ? (
            <Button onClick={onCancel} color="primary" variant="outline" className={cx(showCancelCTA && "ml-4")}>
              {cancelText}
            </Button>
          ) : null}
        </>
      ) : null}

      {showCloseCTA ? (
        <Button onClick={onClose} color="primary" variant="outline">
          {closeText}
        </Button>
      ) : null}
    </div>
  );
}

Modal.Body = ModalBody
Modal.Footer = ModalFooter

export default Modal
