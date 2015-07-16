#!/usr/bin/env node

// dependencies
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var fs = require('fs');
var path = require('path');
// class prototype

var Path = (function () {
  function Path(pathstring) {
    _classCallCheck(this, Path);

    this.apply(pathstring);
  }

  _createClass(Path, [{
    key: 'apply',
    value: function apply(pathstring) {
      pathstring = Path.normalize(pathstring);
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
  }], [{
    key: 'normalize',
    value: function normalize(pathstring) {
      pathstring = path.normalize(pathstring);
      if (pathstring != './' && pathstring[pathstring.length - 1] === '/') {
        return pathstring.substring(0, pathstring.length - 1);
      }
      return pathstring;
    }
  }]);

  return Path;
})();

// the program starts here
// using IIFE here because I want to be able to terminate the program during runtime by executing "return" statement
(function () {
  var args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('please enter source, dest paths');
    return;
  }
  // source files are everything in the arguments but the last one
  var sourcePaths = args.slice(0, -1);
  var sources = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sourcePaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var each = _step.value;

      sources.push(new Path(each));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  // dest is the last in the argument list
  var dest = new Path(args[args.length - 1]);
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = sources[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var source = _step2.value;

      console.log('moving :', source.full);
      console.log('to: ', dest.full);
      console.log('by leaving a symbolic link...');
      // move it, from source to dest
      // declaaring thisDest because each dest is a little but different. (by .append)
      var thisDest = new Path(dest.full);
      if (thisDest.isDir()) {
        thisDest.append(source.basename);
      }
      fs.renameSync(source.full, thisDest.full);
      // create a symlink
      fs.symlinkSync(thisDest.full, source.full);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  // the whole process is done
  console.log('done!');
})();