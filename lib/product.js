const fs = require("fs");
const path = require('path');
const util = require('./util');
const async = require('async');

function Product(p) {
    "use strict";

    this.id = p.id;
    this.name = p.name;
    this.images = p.images || [];
    this.description = p.description || "";
    this.price = p.price || "";
}

Product.Load = function(dir, cb) {
    "use strict";

    async.waterfall([
        function(cb) {
            return fs.readdir(dir, cb);
        },
        function(filesList, cb) {
            async.parallel({
                images: function(cb) {
                    const images = filesList
                        .filter(util.isImage)
                        .map(function(item) {
                            return dir + '/' + item;
                        });
                    return cb(null, images);
                },
                description: function(cb) {
                    const descriptionFile = filesList.find(util.IsDecriptionFile);
                    return descriptionFile !== undefined ? fs.readFile(dir + '/' + descriptionFile, cb) : cb(null, undefined);
                },
                price: function(cb) {
                    const priceFile = filesList.find(util.IsPriceFile);
                    return priceFile !== undefined ? fs.readFile(dir + '/' + priceFile, cb) : cb(null, undefined);
                },
                id: function(cb) {
                    return cb(null, path.basename(dir).replace(/\s+/g, '_').toLowerCase());
                },
                name: function(cb) {
                    return cb(null, path.basename(dir));
                }
            }, cb);
        },
        function(rawProduct, cb) {
            return cb(null, new Product(rawProduct));
        }
    ], cb);
};

Product.prototype.makeRelative = function(root) {
    "use strict";

    this.images = this.images.map(function(image) {
        return path.relative(root, image);
    });

    return this;
};


module.exports = Product;