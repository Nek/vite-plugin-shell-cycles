(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "child_process", "chalk"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const child_process_1 = require("child_process");
    const chalk_1 = require("chalk");
    function execute(input) {
        return new ShellPlugin(input);
    }
    exports.default = execute;
    class ShellPlugin {
        constructor(i) {
            try {
                this.expected = [
                    'buildEnd',
                    'buildStart',
                    'closeWatcher',
                    'watchChange',
                    'moduleParsed',
                    'generateBundle',
                    'renderError',
                    'renderStart',
                    'writeBundle',
                    'transformIndexHtml',
                    'configureServer',
                    'handleHotUpdate',
                ];
                this.name = 'shell-cycles';
                if (typeof i !== 'object' && i === null)
                    throw 'expected import to be an object';
                for (const k in i) {
                    this.validateKey(i[k], k) && this.addProperty(i[k], k);
                }
            }
            catch (e) {
                console.error(`${chalk_1.default.white.bgRed.bold('Shell-Cycles:Error')} ${chalk_1.default.red('expected an object, but got')} ${chalk_1.default.underline(typeof i)}`);
                console.error('---------------');
                console.error(e);
            }
        }
        addProperty(i, k) {
            this[k] = () => {
                this.runScripts(i);
            };
        }
        validateKey(i, k) {
            let z = false;
            let n = false;
            try {
                this.expected.forEach((b) => {
                    b === k && (n = true);
                });
                if (n) {
                    try {
                        i.commands.forEach((b) => {
                            if (typeof b !== 'string') {
                                z = true;
                            }
                        });
                    }
                    catch (e) {
                        console.error(`${chalk_1.default.white.bgRed.bold('Shell-Cycles:Error')} ${chalk_1.default.underline(k)}'s ${chalk_1.default.red('commands property didnt exist or wasnt an array of strings so was skipped')}`);
                        console.error('---------------');
                        console.error(e);
                        return false;
                    }
                    return i && i.commands && !z;
                }
                else {
                    throw `${k} wasnt found in the importOptions`;
                }
            }
            catch (p) {
                console.error(`${chalk_1.default.white.bgRed.bold('Shell-Cycles:Error')} ${chalk_1.default.underline(k)}'s ${chalk_1.default.red('wasnt an expexted import option')}`);
                console.error('---------------');
                console.error(p);
            }
            return true;
        }
        runScripts(cb) {
            const z = cb.commands.slice(0);
            const next = function () {
                let c;
                if (!(c = z.shift())) {
                    return;
                }
                if (cb.sync !== undefined && cb.sync === true) {
                    const r = (0, child_process_1.spawnSync)(c, {
                        shell: true,
                        stdio: 'inherit',
                        env: process.env,
                    });
                    if (r.status === 0) {
                        next();
                    }
                }
                else {
                    (0, child_process_1.spawn)(c, {
                        shell: true,
                        stdio: 'inherit',
                        env: process.env,
                    }).on('close', (b) => {
                        if (b === 0) {
                            next();
                        }
                    });
                }
            };
            next();
        }
    }
});
