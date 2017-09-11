/**
 * Created by luckybug on 08.09.17.
 */

const express = require('express');
const router = express.Router();
const Catalog = require("../lib/catalog");

Catalog.Load("./public/data", function(err, catalog) {
    "use strict";

    if(err)
        console.log(err);
    else
        console.log(catalog);
    // console.log(service, err)

    catalog.makeRelative("./public");

    catalog.services.forEach(function (service) {
        router.get('/' + service.id, function(req, res, next) {
            res.render('index', {
                services: catalog.services,
                service: service
            });
        });
    });

});

// console.log(service);


module.exports = router;