
import Server from "..";
import request from "supertest";
import {updatedIssue1} from "../mockdata/updatedIssue1"
import {updatedIssue2} from "../mockdata/updatedIssue2"
import {updatedIssue3} from "../mockdata/updatedIssue3"
import {createdIssue} from "../mockdata/createdIssue"

describe("POST / - a simple api endpoint", () => {
  it('should return status "OK" when posting updated issue1', async  () => {
    await request(Server).post('/jiraissue').send(updatedIssue1).expect(200)
  })
  it('should return status "OK" when posting updated issue2', async  () => {
    await request(Server).post('/jiraissue').send(updatedIssue2).expect(200)
  })
  it('should return status "OK" when posting updated issue3', async  () => {
    await request(Server).post('/jiraissue').send(updatedIssue3).expect(200)
  })

  it('should return status "OK" when posting created issue', async  () => {
    await request(Server).post('/jiraissue').send(createdIssue).expect(200)
  })

})