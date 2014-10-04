/**
 * grunt-laravel
 * @author vitre
 * @licence MIT
 * @version 1.1.22
 * @url https://www.npmjs.org/package/grunt-laravel
 */

"use strict"

var fs = require('fs'),
    path = require('path'),
    extend = require('node.extend');

//---

var defaults = {
    public: 'public',
    workbench: 'workbench',
    gruntFile: 'Gruntfile.js',
    resources: 'Resources'
};

var options;

var packages;

var grunt;

/**
 * getPackages
 * @param root
 * @param r
 */
var getPackages = function (root, r) {
    if (typeof root === 'undefined') {
        root = defaults.workbench;
    }
    if (typeof r === 'undefined') {
        r = [];
    }

    var files = fs.readdirSync(root);
    for (var i in files) {
        var path = root + '/' + files[i];
        if (fs.statSync(path).isDirectory()) {

            var name = path.substr(defaults.workbench.length + 1, path.length);
            var name_camelcase = name.replace(/\//g, '');
            var name_public = name_camelcase.toLowerCase();

            var _package = {
                name: name,
                name_camelcase: name_camelcase,
                name_public: name_public,
                path: path,
                resources: path + '/' + defaults.resources,
                public: options.public + '/packages/' + name_public
            };

            r.push(_package);

            getPackages(path, r);
        }
    }
    return r;
};

/**
 * importPackage
 * @param _package
 * @param config
 */
var importPackage = function (_package, config) {
    var gruntFile = _package.path + '/' + defaults.gruntFile;
    if (fs.existsSync(gruntFile)) {
        var filePath = path.resolve(gruntFile);

        console.log('Importing package: ' + _package.name + ' [' + gruntFile + ']');

        require(filePath)(grunt, config, _package, options);
    }
};

/**
 * importPackages
 * @param config
 */
var importPackages = function (config) {
    packages = getPackages();
    for (var i = 0; i < packages.length; i++) {
        importPackage(packages[i], config);
    }
};

/**
 * Export importPackages
 * @param _grunt
 * @param config
 * @param _options
 */
exports.importPackages = function (_grunt, config, _options) {
    grunt = _grunt;
    if (typeof _options === 'undefined') {
        options = defaults;
    } else {
        options = extend(true, {}, defaults, _options);
    }
    importPackages(config);
}
