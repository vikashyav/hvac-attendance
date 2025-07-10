// import ReactDOM from "react-dom";
// import PropTypes from "prop-types";

// export default function Portal(props) {
//   const { parent, children } = props;
//   return ReactDOM.createPortal(children, parent );//|| document.body);
// }

// Portal.defaultProps = {
//   parent: null,
//   children: null,
// };

// Portal.propTypes = {
//   parent: PropTypes.oneOfType([PropTypes.instanceOf(Element), PropTypes.node]),
//   children: PropTypes.node,
// };
"use client"
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // No need for 'ReactDOM' directly, just createPortal

export default function Portal({ children, parent }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Cleanup function (optional, but good practice if you were cleaning up portal elements)
    return () => setMounted(false);
  }, []);

  // Only render the portal if the component is mounted on the client
  return mounted ? createPortal(children, parent || document.body) : null;
}