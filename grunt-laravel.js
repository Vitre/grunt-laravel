/**
 * grunt-laravel
 * @author vitre
 * @licence MIT
 * @version 0.0.x
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
    resources: 'src'
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
            var name_dashed = name.replace(/\//g, '-');
            var name_underscore = name.replace(/\//g, '_').replace(/-/g, '_');
            var name_public = name_camelcase.toLowerCase();

            var pkg = {
                name: name,
                name_camelcase: name_camelcase,
                name_dashed: name_dashed,
                name_underscore: name_underscore,
                name_public: name_public,
                path: path,
                resources: path + '/' + defaults.resources,
                public: options.public + '/packages/' + name_public,
                gruntFile: path + '/' + defaults.gruntFile
            };

            if (fs.existsSync(pkg.gruntFile)) {
                r.push(pkg);
            }

            getPackages(path, r);
        }
    }
    return r;
};

/**
 * importPackage
 * @param pkg
 * @param config
 */
var importPackage = function (pkg, config) {
    var gruntFile = pkg.path + '/' + defaults.gruntFile;
    if (fs.existsSync(gruntFile)) {
        var filePath = path.resolve(gruntFile);

        console.log('Importing package: ' + pkg.name['green'] + (' [' + gruntFile + ']')['grey']);

        require(filePath)(grunt, config, pkg, options);
    }
};

/**
 * importPackages
 * @param config
 */
var importPackages = function (config) {
    packages = getPackages();

    for (var i = 0; i < packages.length; i++) {

        config.laravel.packages[packages[i].name_underscore] = packages[i];

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

    config.laravel = extend(config.laravel, {
        packages: {},
        dist_tasks: [],
        dev_tasks: []
    });

    importPackages(config);
}
