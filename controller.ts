import service from "./service";
import  {Request, Response}  from "express";
import HttpStatus from "http-status-codes";
import { JiraObject } from "./interfaces";

class Controller {
    create(req: Request, res: Response):void {
        const issue =  req.body.issue
        const JiraObject = {
            issue,
            changeLog: req.body.changelog,
            user: req.body.user,
            jiraURL: issue.self.split('/rest/api')[0]
        }

        service.create(JiraObject).then((r) =>{
        if(!r){
            res
            .status(HttpStatus.IM_A_TEAPOT).end()
        }
        res
            .status(HttpStatus.OK).end()
        });
    };
    get(req: Request, res: Response):void {
        service.get().then((r) => res.sendStatus(HttpStatus.OK));
    }
}

export default new Controller();