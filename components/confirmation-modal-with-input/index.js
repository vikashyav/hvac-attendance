import cx from "../../utils/class-names";
import Modal from "../dialog";
// import PropTypes from "prop-types";

const ConfirmationModal = (props) => {
  const { children, className, isOpen, rootClassName } = props;
  return (
    <Modal className="z-1000" isOpen={isOpen}>
      <div className={cx("min-w-[350px] text-xs flex flex-col", rootClassName)}>
        <div className={cx("confirmation-modal flex flex-col justify-between rounded-[inherit]", className)}>{children}</div>
      </div>
    </Modal>
  );
};
export default ConfirmationModal;
