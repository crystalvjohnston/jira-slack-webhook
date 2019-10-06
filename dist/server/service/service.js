"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = __importStar(require("request-promise-native"));
class Service {
    create(jiraObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const { issue, changeLog, user, jiraURL } = jiraObject;
            let sprintChanged = changeLog.items.find(item => item.field === "Sprint");
            let statusChanged = changeLog.items.find(item => item.field === "status");
            let addedToActiveSprint = false;
            let newStatus = "";
            if (sprintChanged) {
                addedToActiveSprint = this.sprintChangedToActiveSprint(issue.fields.customfield_10910);
            }
            if (statusChanged) {
                newStatus = statusChanged.toString || "";
            }
            if (sprintChanged || statusChanged) {
                let text = "";
                if (addedToActiveSprint) {
                    text += `${user.displayName} added an issue to an active sprint: ${sprintChanged.toString || ""}. `;
                }
                if (newStatus && (newStatus === "To Do" || newStatus === "QE Blocked" || newStatus === "Blocked")) {
                    text += `${user.displayName} marked an issue as ${newStatus}.`;
                }
                if (text) {
                    console.log(text);
                    let postData = Object.assign(Object.assign({}, this.setPostData(issue, user, jiraURL)), { text });
                    return yield this.sentToSlack(postData);
                }
            }
            else {
                console.log("Changes made that were not sent to Slack");
                return true;
            }
        });
    }
    sentToSlack(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = {
                method: 'post',
                body: postData,
                json: true,
                url: process.env.SLACK_URL
            };
            return yield request.post(`${process.env.SLACK_URL}`, options, function (err, response, body) {
                if (err) {
                    console.error('Error posting json: ', err);
                    return false;
                }
                else {
                    console.log('Alerted Slack');
                    return true;
                }
            });
        });
    }
    /*
      * Take an array of sprints (strings) and if you find one where state=active
      * then return true.
      */
    sprintChangedToActiveSprint(sprints) {
        // its possible there are no sprints
        if (!sprints) {
            return false;
        }
        for (let i = 0; i < sprints.length; i++) {
            if (sprints[i].includes('state=ACTIVE')) {
                return true;
            }
        }
        return false;
    }
    setPostData(issue, user, jiraURL) {
        return {
            attachments: [
                {
                    fallback: `${user.displayName} updated <${jiraURL}/browse/${issue.key}|${issue.key}: ${issue.fields.summary}>`,
                    color: 'good',
                    title: `<${jiraURL}/browse/${issue.key}|${issue.key}: ${issue.fields.summary}>`,
                    thumb_url: `${user.avatarUrls["48x48"]}`,
                    fields: [
                        {
                            title: "Status",
                            value: `${issue.fields.status.name}`,
                            short: true
                        },
                        {
                            title: "Story Points",
                            value: `${issue.fields.customfield_10113}`,
                            short: true
                        },
                    ]
                }
            ]
        };
    }
}
exports.default = new Service();
//# sourceMappingURL=service.js.map