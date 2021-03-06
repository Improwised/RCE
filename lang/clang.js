const command = require("../command.js");
const {runner} = require('./common.js')

const executable = fpath => {
  fpath = fpath.split(".")
  fpath.pop();
  fpath = fpath.join(".").split("/");
  fpath.push(fpath.pop().split("-").join(""))
  return fpath.join("/")
}

const compileCode = (file, opt, compiler) => {
  return new Promise(async (resolve, reject) => {
    let exFile = executable(file.name);
    command(compiler, ["-c", file.name])
      .execute(opt)
      .then(() => {
        command(compiler, ["-o", exFile, file.name])
          .execute(opt)
          .then(() => resolve(true))
          .catch(reject)
      })
      .catch(reject);
  })
}

const runCode = (file, opt) => {
  return new Promise(async (resolve, reject) => {
    let exFile = executable(file.name);
    command(exFile).run(opt).then(resolve).catch(reject);
  });
}

const getCompiler = cmplr => {
  return (file, opt) => {
    return compileCode(file, opt, cmplr)
  }
}

const run = (code, input, expected, compiler = "gcc") => {
  return runner("Program.c", code, input, expected, runCode, [getCompiler(compiler)])
}

module.exports = run