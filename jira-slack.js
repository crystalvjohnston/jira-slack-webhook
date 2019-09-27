'use strict';

const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request');

var app = express();
app.set('port', process.env.PORT || 5000);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/test-heroku', function(req, res) {
  res.sendStatus(200);
})

app.post('/jira-issue-added-to-sprint', function(req, res) {
  let issue = req.body.issue,
      changelog = req.body.changelog,
      user = req.body.user,
      jiraURL = issue.self.split('/rest/api')[0];

  let sprintChanged = changelog.items.find(item => item.field === "Sprint")
  let statusChanged = changelog.items.find(item => item.field === "status")
  let addedToActiveSprint = false;
  let newStatus ="";
  if(sprintChanged){
    addedToActiveSprint = sprintChangedToActiveSprint(issue.fields.customfield_10910);
  }
  if(statusChanged){
    newStatus = statusChanged.toString;
  }

  if(sprintChanged || statusChanged){
    let text = "";
    if (addedToActiveSprint) {
      text += `${user.displayName} added an issue to an active sprint: ${sprintChanged.toString}. `
    }
    if(newStatus && (newStatus === "To Do" || newStatus === "QE Blocked" || newStatus === "Blocked")){
      text += `${user.displayName} marked an issue as ${newStatus}.`
    }
    if(text){
      console.log(text)
      let postData = {
        ...setPostData(issue,user,jiraURL),
        text
      }
      sentToSlack(postData, res)
    }
  }else{
    console.log("Changes made that were not sent to Slack")
    res.sendStatus(200)
  }

  function sentToSlack(postData, res){
    let options = {
      method: 'post',
      body: postData,
      json: true,
      url: process.env.SLACK_URL
    }

    request(options, function(err, response, body) {
      if (err) {
        console.error('Error posting json: ', err)
        res.sendStatus(418)
      } else {
        console.log('Alerted Slack')
        res.sendStatus(200)
      }
    })
  }

  /*
    * Take an array of sprints (strings) and if you find one where state=active
    * then return true.
    */
  function sprintChangedToActiveSprint(sprints) {
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

  function setPostData(issue,user,jiraURL){
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
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
module.exports = app;