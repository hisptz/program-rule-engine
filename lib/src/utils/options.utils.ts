import { Option } from "../interfaces/rules-engine.types";

export const getoptionSetCode = (options:Option[], key:string) => {
  if (options) {
    const option = options.find(o => o.displayName === key);
    return (option && option.code) || key;
  }
  return key;
};

export const getoptionSetName = (options:Option[], key:string) => {
  if (options) {
    const option = options.find(o => o.code === key);
    return (option && option.displayName) || key;
  }
  return key;
};
