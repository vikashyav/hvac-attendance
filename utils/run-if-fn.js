import is from "./types";

export function runIfFn(valueOrFn, ...args) {
  return is.function(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}
