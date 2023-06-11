const ObjProto = Object.prototype;
const { toString, hasOwnProperty } = ObjProto;

export function isValidIP(ip: string): boolean {
  const reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return reg.test(ip);
}

export const isArray = (anyOpt: unknown): boolean => {
  return toString.call(anyOpt) === '[object Array]';
};

export const isString = (obj: unknown): boolean => {
  return toString.call(obj) === '[object String]';
};

export const isArguments = (obj: unknown): boolean => {
  return toString.call(obj) === '[object Arguments]';
};

export const isObject = (obj: unknown): boolean => {
  return toString.call(obj) === '[object Object]';
};

export const has = (obj: unknown, key: string) => {
  return obj !== null && hasOwnProperty.call(obj, key);
};

export const isEmpty = (anyOpt: string | Record<string, any> | any): boolean => {
  if (anyOpt === null) {
    return true;
  }
  if (isArray(anyOpt) || isString(anyOpt) || isArguments(anyOpt)) {
    return anyOpt.length === 0;
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const key in anyOpt) {
    if (has(anyOpt, key)) {
      return false;
    }
  }
  return true;
};
