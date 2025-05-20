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
Protofy("object", "tickets")
const {name, prefix} = Objects.tickets.getApiOptions()

const ticketsAPI = AutoAPI({
    modelName: name,
    modelType: Objects.tickets,
    initialData: {},
    prefix: prefix
})

const ticketsActions = AutoActions({
    modelName: name,
    modelType: Objects.tickets,
    prefix: prefix
})

export default Protofy("code", async (app:Application, context: typeof APIContext) => {
    ticketsAPI(app, context)
    ticketsActions(app, context)
    //you can add more apis here, like:
    /*
    app.get('/api/v1/test/tickets', (req, res) => {
        //you code goes here
        //reply with res.send(...)
    })
    */      
})