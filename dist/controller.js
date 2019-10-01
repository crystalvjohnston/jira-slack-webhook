"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("./service"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Controller {
    create(req, res) {
        const issue = req.body.issue;
        const JiraObject = {
            issue,
            changeLog: req.body.changelog,
            user: req.body.user,
            jiraURL: issue.self.split('/rest/api')[0]
        };
        service_1.default.create(JiraObject).then((r) => {
            if (!r) {
                res
                    .status(http_status_codes_1.default.IM_A_TEAPOT).end();
            }
            res
                .status(http_status_codes_1.default.OK).end();
        });
    }
    ;
}
exports.default = new Controller();
//# sourceMappingURL=controller.js.map