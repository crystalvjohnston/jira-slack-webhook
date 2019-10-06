"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./controller/router"));
var app = express_1.default();
class ExpressServer {
    constructor() {
        const root = path_1.default.normalize(__dirname + "/../..");
        app.set("appPath", root + "client");
        app.use(body_parser_1.default.json({ limit: process.env.REQUEST_LIMIT || "100kb" }));
        app.use(body_parser_1.default.urlencoded({
            extended: true,
            limit: process.env.REQUEST_LIMIT || "100kb"
        }));
        //app.use(cookieParser(process.env.SESSION_SECRET));
        app.use(express_1.default.static(`${root}/public`));
        const apiSpecPath = path_1.default.join(__dirname, "api.yml");
        app.use(process.env.OPENAPI_SPEC || "/spec", express_1.default.static(apiSpecPath));
        const options = {
            explorer: true,
            swaggerOptions: {
                url: process.env.OPENAPI_SPEC || "/spec"
            }
        };
        app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(null, options));
        app.use("/jiraissue", router_1.default);
    }
    listen(p = process.env.PORT) {
        const welcome = (port) => () => console.log('Node app is running on port', port);
        http_1.default.createServer(app).listen(p, welcome(p));
        return app;
    }
}
exports.default = ExpressServer;
//# sourceMappingURL=server.js.map