import { useEffect } from "react";
import types from "../utils/types";

export default function useKeyPress(element = document, targetKey, handler) {
  useEffect(() => {
    function upHandler(event) {
      if (types.isArray(targetKey) && targetKey.includes(event.key)) {
        handler(event);
      } else if (event.key === targetKey) {
        handler(event);
      }
    }
    element && element.addEventListener("keydown", upHandler);
    return () => {
      element && element.removeEventListener("keydown", upHandler);
    };
  }, [element, handler, targetKey]);
}
