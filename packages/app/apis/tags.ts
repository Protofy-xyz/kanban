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
Protofy("object", "tags")
const {name, prefix} = Objects.tags.getApiOptions()

const tagsAPI = AutoAPI({
    modelName: name,
    modelType: Objects.tags,
    initialData: {},
    prefix: prefix
})

const tagsActions = AutoActions({
    modelName: name,
    modelType: Objects.tags,
    prefix: prefix
})

export default Protofy("code", async (app:Application, context: typeof APIContext) => {
    tagsAPI(app, context)
    tagsActions(app, context)
    //you can add more apis here, like:
    /*
    app.get('/api/v1/test/tags', (req, res) => {
        //you code goes here
        //reply with res.send(...)
    })
    */      
})