grunt-laravel ![Monthly downloads](http://img.shields.io/npm/dm/grunt-laravel.svg)
=============

Grunt module for Laravel.

[![NPM](https://nodei.co/npm/grunt-laravel.png)](https://nodei.co/npm/grunt-laravel/)

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

Gruntfile config registry
-------------------------
Task stores some information into global grunt config variable. You can use it for custom task creation.

`config.laravel: { packages: {}, dist_tasks: [], dev_tasks: [] } `

### Task creation example

#### Package gruntfile
```javascript
config.laravel.dev_tasks.push('uglify:' + package.name + '_dev');
```

#### Global gruntfile
```javascript
grunt.registerTask('build', [].concat(['sass'], config.laravel.dist_tasks, ['uglify']));
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

##### name_underscore

Type: `String`

Package name in underscore format.

##### name_dashed

Type: `String`

Package name in dashed format.

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

Release 0.0.2
-------------
* Package object new names (`name_dashed`, `name_underscore`)
* Grunt config `laravel` registry `config.laravel: { packages: {...}, dist_tasks: [...], dev_tasks: [...] } `


