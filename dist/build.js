"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = __importDefault(require("shelljs"));
const config = require('./tsconfig.json');
const outDir = config.compilerOptions.outDir;
shelljs_1.default.rm('-rf', outDir);
shelljs_1.default.mkdir(outDir);
shelljs_1.default.cp('api.yml', `${outDir}`);
//# sourceMappingURL=build.js.map