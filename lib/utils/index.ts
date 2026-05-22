import * as stringUtils from "./string";
import * as dateUtils from "./date";
import * as fileUtils from "./file";
// import * as folderUtils from "./folder";
import * as mapperUtils from "./mapper";
import * as zodUtils from "./zod";


const utils = {
  ...stringUtils,
  ...dateUtils,
  ...fileUtils,
  // ...folderUtils,
  ...mapperUtils,
  ...zodUtils,
};

export default utils;
