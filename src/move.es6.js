#!/usr/bin/env node
// dependencies
let fs = require('fs');
let path = require('path');
// class prototype
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
// the program starts here
// using IIFE here because I want to be able to terminate the program during runtime by executing "return" statement
(() => {
  let args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('please enter source, dest paths');
    return;
  }
  // source files are everything in the arguments but the last one
  let sourcePaths = args.slice(0, -1);
  let sources = [];
  for (let each of sourcePaths) {
    sources.push(new Path(each));
  }
  // dest is the last in the argument list
  let dest = new Path(args[args.length - 1]);
  for (let source of sources) {
    console.log('moving :', source.full);
    console.log('to: ', dest.full);
    console.log('by leaving a symbolic link...');
    // move it, from source to dest
    // declaaring thisDest because each dest is a little but different. (by .append)
    let thisDest = new Path(dest.full);
    if (thisDest.isDir()) {
      thisDest.append(source.basename);
    }
    fs.renameSync(source.full, thisDest.full);
    // create a symlink
    fs.symlinkSync(thisDest.full, source.full);
  }
  // the whole process is done
  console.log('done!');
})();
