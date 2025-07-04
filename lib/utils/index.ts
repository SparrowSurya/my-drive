import * as stringUtils from "./string";
import * as dateUtils from "./date";
import * as treeUtils from "./tree";
import * as appUtils from "./app";


const utils = {
  ...stringUtils,
  ...dateUtils,
  ...treeUtils,
  ...appUtils,
};

export default utils;
