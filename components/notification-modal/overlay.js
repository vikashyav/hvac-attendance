// "use client"
// import React from "react"
// import cx from "../../utils/cx"
// import { useNotificationModalContext } from "./provider"

// function Overlay(props) {
//   const { children } = props

//   const notificationModal = useNotificationModalContext()

//   return (
//     <div
//       onClick={notificationModal.handleOverlayClick}
//       className={cx(
//         "notification-modal_overlay h-screen w-screen bg-black/30 z-[100000] fixed inset-0 flex invisible transition-all delay-75",
//         notificationModal.open && "visible",
//         notificationModal.classNames?.root
//       )}
//     >
//       {children}
//     </div>
//   )
// }

// export default Overlay

"use client";
import React from "react";
import cx from "../../utils/cx";
import { useNotificationModalContext } from "./provider";

function Overlay({ children }) {
  const notificationModal = useNotificationModalContext();

  return (
    <div
      onClick={notificationModal.handleOverlayClick}
      className={cx(
        // "fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 transition-opacity duration-200",
        // "h-screen w-screen bg-black/30 z-[1000] fixed inset-0 flex  transition-all delay-75",
        "notification-modal_overlay h-screen w-screen bg-black/30 z-[10000] fixed inset-0 flex transition-all delay-75",
        notificationModal.open
          ? "opacity-100 visible"
          : "opacity-0 invisible",
        notificationModal.classNames?.root
      )}
    >
      {children}
    </div>
  );
}

export default Overlay;
