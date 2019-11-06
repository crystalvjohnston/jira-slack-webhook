import service from "../service/service";
import  {Request, Response}  from "express";
import HttpStatus from "http-status-codes";
import { JiraObject } from "../interfaces";

class Controller {
    create(req: Request, res: Response):void {
        const issue =  req.body.issue
        const JiraObject = {
            issue,
            eventType: req.body.issue_event_type_name,
            changeLog: req.body.changelog,
            user: req.body.user,
            jiraURL: issue.self.split('/rest/api')[0]
        }

        service.create(JiraObject).then((r:any) =>{
        if(!r){
            res
            .status(HttpStatus.BAD_REQUEST).end()
        }
        res
            .status(HttpStatus.OK).end()
        });
    };
    // get(req: Request, res: Response):void {
    //     service.get().then((r) => res.sendStatus(HttpStatus.OK));
    // }
}

export default new Controller();