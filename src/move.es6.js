#!/usr/bin/env node
(() => {
  let fs = require('fs');
  let path = require('path');

  let args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('please enter source, dest paths');
    return;
  }

  class Path {
    constructor(pathstring) {
      this.apply(pathstring);
    }
    apply(pathstring) {
      this.full = pathstring;
      this.dir = path.dirname(pathstring);
      this.basename = path.basename(pathstring);
    }
    isDir() {
      if (!fs.existsSync(this.full)) {
        return false;
      }
      return fs.statSync(this.full).isDirectory();
    }
    append(pathstring) {
      this.apply(path.join(this.full, pathstring));
    }
  }

  let source = new Path(args[0]);
  let dest = new Path(args[1]);

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
