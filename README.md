grunt-laravel
=============

Grunt module for Laravel.

![Monthly downloads](http://img.shields.io/npm/dm/grunt-laravel.svg)

Features
--------

  * gruntfile import for workbench packages

Links
-----

**GitHub**: https://github.com/Vitre/grunt-laravel

**NPM**: https://www.npmjs.org/package/grunt-laravel

Install
-------

    $ npm install grunt-laravel

Package gruntfile
-------------

[PACKAGE_ROOT]/Gruntfile.js

```javascript
module.exports = function (grunt, config, pkg, options) {

    config.sass = config.sass || {};
    config.sass[pkg.name + "_dist"] = {
        "options": {
            "style": "compressed",
            "compass": true
        },
        "files": [
            {
                "expand": true,
                "cwd": pkg.resources + "/public/scss",
                "src": ["*.scss"],
                "dest": options.web + "/admin/@/css",
                "ext": ".css"
            }
        ]
    };

    config.watch = config.watch || {};
    config.watch[pkg.name + "_sass"] = {
        files: pkg.resources + "/public/scss/**/*.scss",
        tasks: ["sass:" + pkg.name + "_dist"]
    };

};
```

Gruntfile implementation
------------------------

```javascript
/*global module:false*/

// grunt-laravel import
var gruntLaravel = require('grunt-laravel');

module.exports = function (grunt) {

    // Base configuration.
    var config = {

        // Metadata
        pkg: grunt.file.readJSON('package.json'),

        // [...] Your tasks

    };

    // Laravel packages import
    gruntLaravel.importPackages(grunt, config, {
        public: 'public',
        workbench: 'workbench',
        gruntFile: 'Gruntfile.js',
        resources: 'src'
    });

    //---

    grunt.initConfig(config);

    // Modules
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Tasks
    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('build', ['sass']);

};

```

API
---

### Importing

```javascript
var gruntLaravel = require('grunt-laravel');
```

### Methods

**gruntLaravel.importPackages**(grunt, config, [options])

Recursively imports packages Gruntfile.js

#### Options

##### public

Type: `String` Default: 'public'

Public folder path.

##### workbench

Type: `String` Default: 'workbench'

Resources path.

##### gruntFile

Type: `String` Default: 'Gruntfile.js'

Package Gruntfile filename.

##### resources

Type: `String` Default: 'src'

Package resources folder name.



### Package object

#### Properties

##### name

Type: `String`

Package name.

##### name_camelcase

Type: `String`

Package name in camelcase.

##### name_public

Type: `String`

Package public name.

##### path

Type: `String`

Package path.

##### resources

Type: `String`

Package resources path.

##### public

Type: `String`

Package public path.
