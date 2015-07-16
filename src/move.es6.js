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
    static normalize(pathstring) {
      pathstring = path.normalize(pathstring);
      if (pathstring[pathstring.length - 1] === '/') {
        return pathstring.substring(0, pathstring.length - 1);
      }
      return pathstring;
    }
    apply(pathstring) {
      pathstring = Path.normalize(pathstring);
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

  let sourcePaths = args.slice(0, -1);
  let sources = [];
  for (let each of sourcePaths) {
    sources.push(new Path(each));
  }
  let dest = new Path(args[args.length - 1]);

  for (let source of sources) {
    console.log('moving :', source.full);
    console.log('to: ', dest.full);
    console.log('by leaving a symbolic link...');
    // move it
    let thisDest = new Path(dest.full);
    if (thisDest.isDir()) {
      thisDest.append(source.basename);
    }
    fs.renameSync(source.full, thisDest.full);
    // create a symlink
    fs.symlinkSync(thisDest.full, source.full);
  }

  console.log('done!');

})();
