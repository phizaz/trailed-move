#!/usr/bin/env node
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var fs = require('fs');
  var path = require('path');

  var args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('please enter source, dest paths');
    return;
  }

  var Path = (function () {
    function Path(pathstring) {
      _classCallCheck(this, Path);

      this.apply(pathstring);
    }

    _createClass(Path, [{
      key: 'apply',
      value: function apply(pathstring) {
        this.full = pathstring;
        this.dir = path.dirname(pathstring);
        this.basename = path.basename(pathstring);
      }
    }, {
      key: 'isDir',
      value: function isDir() {
        if (!fs.existsSync(this.full)) {
          return false;
        }
        return fs.statSync(this.full).isDirectory();
      }
    }, {
      key: 'append',
      value: function append(pathstring) {
        this.apply(path.join(this.full, pathstring));
      }
    }]);

    return Path;
  })();

  var source = new Path(args[0]);
  var dest = new Path(args[1]);

  console.log('moving :', source.full);
  console.log('to: ', dest.full);
  console.log('by leaving a symbolic link...');

  // move it
  if (dest.isDir()) {
    dest.append(source.basename);
  }
  fs.renameSync(source.full, dest.full);
  // create a symlink
  fs.symlinkSync(dest.full, source.full);

  console.log('done!');
})();