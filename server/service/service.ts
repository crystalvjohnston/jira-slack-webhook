import { JiraObject } from "../interfaces";
import * as request from "request-promise-native";


class Service {
    async create(jiraObject: JiraObject): Promise<boolean | undefined> {
        const {issue, changeLog, user, jiraURL} = jiraObject;

        let sprintChanged = changeLog.items.find(item => item.field === "Sprint")
        let statusChanged = changeLog.items.find(item => item.field === "status")
        let addedToActiveSprint = false;
        let newStatus = "";
        if(sprintChanged){
          addedToActiveSprint = this.sprintChangedToActiveSprint(issue.fields.customfield_10910);
        }
        if(statusChanged){
          newStatus = statusChanged.toString || "";
        }
      
        if(sprintChanged || statusChanged){
          let text = "";
          if (addedToActiveSprint) {
            text += `${user.displayName} added an issue to an active sprint: ${sprintChanged!.toString || "" }. `
          }
          if(newStatus && (newStatus === "To Do" || newStatus === "QE Blocked" || newStatus === "Blocked")){
            text += `${user.displayName} marked an issue as ${newStatus}.`
          }
          if(text){
            console.log(text)
            let postData = {
              ...this.setPostData(issue,user,jiraURL),
              text
            }
            return await this.sentTo(postData)
          }
        }else{
          console.log("Changes made that were not sent to Slack")
          return true;
        }
    }
      
        async sentToSlack(postData: any) {
          let options = {
            method: 'post',
            body: postData,
            json: true,
            url: process.env._URL
          } 
      
          return await request.post(`${process.env.SLACK_URL}`, options, function(err, response, body) {
            if (err) {
              console.error('Error posting json: ', err)
              return false;
            } else {
              console.log('Alerted Slack')
              return true;
            }
          })
        }
      
        /*
          * Take an array of sprints (strings) and if you find one where state=active
          * then return true.
          */
     sprintChangedToActiveSprint(sprints: any) {
          // its possible there are no sprints
          if (!sprints) {
            return false
          }
      
          for (let i=0; i < sprints.length; i++) {
            if (sprints[i].includes('state=ACTIVE')) {
              return true
            } 
          }
          return false
        }
      
         setPostData(issue: any,user: any ,jiraURL: any){
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
          }
        }
      
    }


export default new Service();