import bodyParser from "body-parser";
import express from "express";
import { Application } from "express";
import http from "http";
import swaggerUi from "swagger-ui-express";
import path from "path";
import router from "./controller/router"

var app = express();

export default class ExpressServer {
    constructor() {
        const root = path.normalize(__dirname + "/../..");
        app.set("appPath", root + "client");
        app.use(
            bodyParser.json({ limit: process.env.REQUEST_LIMIT || "100kb" })
        );
        app.use(
            bodyParser.urlencoded({
                extended: true,
                limit: process.env.REQUEST_LIMIT || "100kb"
            })
        );
        //app.use(cookieParser(process.env.SESSION_SECRET));
        app.use(express.static(`${root}/public`));
        const apiSpecPath = path.join(__dirname, "api.yml");

        app.use(process.env.OPENAPI_SPEC || "/spec", express.static(apiSpecPath));

        const options = {
            explorer: true,
            swaggerOptions: {
                url: process.env.OPENAPI_SPEC || "/spec"
            }
        };
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
        app.use("/jiraissue", router)
    }

    listen(p: string | number = process.env.PORT!): Application {
        const welcome = (port: string | number) => () =>
            console.log('Node app is running on port', port);
        http.createServer(app).listen(p, welcome(p));
        return app;
    }
}