/**
 * Created by luckybug on 09.09.17.
 */

const Product = require('./product');
const fs = require("fs");
const async = require('async');
const util = require('./util');
const path = require('path');
const translit = require('translitit-cyrillic-russian-to-latin');

function Service(s) {
    "use strict";

    this.id = s.id;
    this.name = s.name;
    this.description = s.description;
    this.products = s.products || [];
}

Service.Load = function(dir, cb) {
    "use strict";

    return async.waterfall([
        function(cb) {
            return fs.readdir(dir, cb);
        },
        function (fileList, cb) {
            async.parallel({
                products: function(cb) {
                    async.map(
                        fileList.map(function(p) {return dir + '/' + p;}).filter(util.IsDirectory),
                        Product.Load,
                        cb
                    )
                },
                description: function(cb) {
                    const descriptionFile = fileList.find(util.IsDecriptionFile);
                    return descriptionFile !== undefined ? fs.readFile(dir + '/' + descriptionFile, cb) : cb(null, undefined);
                },
                id: function(cb) {
                    return cb(null, translit(path.basename(dir).replace(/\s+/g, '_').toLowerCase()));
                },
                name: function(cb) {
                    return cb(null, path.basename(dir));
                }
            }, cb);
        },
        function(rawService, cb) {
            return cb(null,  new Service(rawService));
        }
    ], cb);
};

Service.prototype.makeRelative = function(root) {
    "use strict";

    this.products.forEach(function(product){
        product.makeRelative(root);
    });

    return this;
};

module.exports = Service;