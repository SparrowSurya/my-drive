import * as stringUtils from "./string";
import * as dateUtils from "./date";
import * as treeUtils from "./tree";


const utils = {
  ...stringUtils,
  ...dateUtils,
  ...treeUtils,
};

export default utils;
