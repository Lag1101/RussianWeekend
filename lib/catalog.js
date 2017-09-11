/**
 * Created by luckybug on 11.09.17.
 */

const fs = require("fs");
const async = require("async");
const Service = require("./service");
const util = require("./util");

function Catalog(c) {
    "use strict";

    this.services = c.services || [];
}

Catalog.Load = function(dir, cb) {
    "use strict";

    return async.waterfall([
        function(cb) {
            return fs.readdir(dir, cb);
        },
        function (fileList, cb) {
            async.parallel({
                services: function(cb) {
                    async.map(
                        fileList.map(function(p) {return dir + '/' + p;}).filter(util.IsDirectory),
                        Service.Load,
                        cb
                    )
                }
            }, cb);
        },
        function(rawCatalog, cb) {
            console.log(rawCatalog)
            return cb(null,  new Catalog(rawCatalog));
        }
    ], cb);
};

Catalog.prototype.makeRelative = function(root) {
    "use strict";

    this.services.forEach(function(service){
        service.makeRelative(root);
    });

    return this;
};

module.exports = Catalog;