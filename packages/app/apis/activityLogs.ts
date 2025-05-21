import { Objects } from "app/bundles/objects";
import { AutoActions, AutoAPI, getAuth, getServiceToken } from 'protonode'
import { APIContext } from "protolib/bundles/apiContext"
import { API, Protofy, getLogger } from "protobase";
import { Application } from 'express';
import fs from 'fs'
import path from "path";

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "AutoAPI")
Protofy("object", "activityLogs")
const {name, prefix} = Objects.activityLogs.getApiOptions()

const activityLogsAPI = AutoAPI({
    modelName: name,
    modelType: Objects.activityLogs,
    initialData: {},
    prefix: prefix
})

const activityLogsActions = AutoActions({
    modelName: name,
    modelType: Objects.activityLogs,
    prefix: prefix
})

export default Protofy("code", async (app:Application, context: typeof APIContext) => {
    activityLogsAPI(app, context)
    activityLogsActions(app, context)
    //you can add more apis here, like:
    /*
    app.get('/api/v1/test/activityLogs', (req, res) => {
        //you code goes here
        //reply with res.send(...)
    })
    */      
})