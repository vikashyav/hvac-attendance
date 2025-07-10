const TYPES = {
  UNDEFINED: "[object Undefined]",
  NULL: "[object Null]",
  BOOLEAN: "[object Boolean]",
  NUMBER: "[object Number]",
  STRING: "[object String]",
  ARRAY: "[object Array]",
  OBJECT: "[object Object]",
  FUNCTION: "[object Function]",
};
function getType(val) {
  return Object.prototype.toString.call(val);
}
const types = {
  isUndefined: (val) => getType(val) === TYPES.UNDEFINED,
  isNull: (val) => getType(val) === TYPES.NULL,
  isBoolean: (val) => getType(val) === TYPES.BOOLEAN,
  isNumber: (val) => getType(val) === TYPES.NUMBER,
  isString: (val) => getType(val) === TYPES.STRING,
  isArray: (val) => getType(val) === TYPES.ARRAY,
  isObject: (val) => getType(val) === TYPES.OBJECT,
  isFunction: (val) => getType(val) === TYPES.FUNCTION,
};
export default types;
