import React from 'react'
// import PropTypes from "prop-types"
import Portal from "../Core/Portal"
import Modal, { ModalBody, ModalFooter } from "./modal"
import Overlay from "./overlay"

function NotificationModal() {
  return (
    <Portal>
      <Overlay>
        <Modal>
          <ModalBody/>
          <ModalFooter />
        </Modal>
      </Overlay>
     </Portal>
  )
}
NotificationModal.defaultProps = {
  confirmText: "",
  cancelText: "",
  closeText: "",
  heading: "",
  body: "",
}

// NotificationModal.propTypes = {
//   heading: PropTypes.string,
//   body: PropTypes.string,
//   confirmText: PropTypes.string,
//   cancelText: PropTypes.string,
//   closeText: PropTypes.string,
//   showConfirmCTA: PropTypes.bool,
//   showCancelCTA: PropTypes.bool,
//   showCloseCTA: PropTypes.bool,
//   success: PropTypes.func,
//   error: PropTypes.func,
//   info: PropTypes.func,
//   warning: PropTypes.func,
//   progress: PropTypes.func,
//   close: PropTypes.func,
//   onCancel: PropTypes.func,
//   onClose: PropTypes.func,
//   handleOverlayClick: PropTypes.func,
// }

export default NotificationModal
