/**
 * Created by luckybug on 08.09.17.
 */

const path = require('path');
const fs = require("fs");


/**
 * @return {boolean}
 */
module.exports.isImage = function(p) {
    "use strict";
    switch(path.extname(p).toLowerCase()) {
        case ".jpg":
        case ".png":
            return true;
    }
    return false;
};

/**
 * @return {boolean}
 */
module.exports.IsDecriptionFile = function(p) {
    "use strict";

    switch(path.basename(p).toLowerCase()) {
        case "description.txt":
        case "des.txt":
            return true;
    }
    return false;
};

/**
 * @return {boolean}
 */
module.exports.IsPriceFile = function(p) {
    "use strict";

    return path.basename(p) == "price.txt";
};

/**
 * @return {boolean}
 */
module.exports.IsDirectory = function(p) {
    "use strict";

    return fs.lstatSync(p).isDirectory();
};

/**
 * @return {string}
 */
module.exports.MakeId = function(s) {
    "use strict";

    return s.toLowerCase().replace(/[^a-z\d]/g, '_');
};

