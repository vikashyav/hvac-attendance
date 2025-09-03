// import cx from "@/utils/class-names";
import { cx } from "class-variance-authority";
// import PropTypes from "prop-types";

export default function FormError(props) {
  let { className, message, show, children, ...restProps } = props;
  let errorMessage = message || children;
  if (!show) return null;
  return (
    <div className={cx("form-error text-red-500 mt-1 text-xs form-field-error", className)} {...restProps}>
      {errorMessage}
    </div>
  );
}

// FormError.defaultProps = {
//   message: "",
//   className: "",
//   show: false,
//   children: "",
// };

// FormError.propTypes = {
//   message: PropTypes.string,
//   classNames: PropTypes.string,
//   show: PropTypes.bool,
//   children: PropTypes.node.isRequired,
// };
