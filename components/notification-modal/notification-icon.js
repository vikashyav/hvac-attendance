import Const from "../../constants";

import IconSuccess from "../vectors/icon-success";
import IconWarning2 from "../vectors/icon-warning-red";
import IconLoading from "../vectors/icon-loading";
import IconError from "../vectors/icon-error";
import IconInfo from "../vectors/icon-info";
import { useMemo } from "react";

function NotificationIcon(props) {
  const { type } = props;

  const icon = useMemo(() => {
    switch (type) {
      case Const.NOTIFICATION_TYPE.SUCCESS:
        return <IconSuccess className="w-12 h-12" />;
      case Const.NOTIFICATION_TYPE.ERROR:
        return <IconError className="w-12 h-12" />;
      case Const.NOTIFICATION_TYPE.INFO:
        return <IconInfo className="w-12 h-12" />;
      case Const.NOTIFICATION_TYPE.PROGRESS:
        return <IconLoading className="text-primary-brand w-12 h-12" />;
      case Const.NOTIFICATION_TYPE.WARNING:
        return <IconWarning2 className="text-[#ffbf00] w-12 h-12" />;
      default:
        return null;
    }
  }, [type]);

  return <div className="notification-modal_icon mb-4">{icon}</div>;
}

export default NotificationIcon;
