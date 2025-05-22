import { Objects } from "app/bundles/objects";
import { AutoActions, AutoAPI, getAuth, getServiceToken } from 'protonode'
import { APIContext } from "protolib/bundles/apiContext"
import { API, Protofy, getLogger } from "protobase";
import { Application } from 'express';
import fs from 'fs'
import path from "path";
import moment from "moment";

const root = path.join(process.cwd(), '..', '..')
const logger = getLogger()

Protofy("type", "AutoAPI")
Protofy("object", "tickets")
const { name, prefix } = Objects.tickets.getApiOptions()

const initialData = {
    "202504-031241-01251-6599d856": {
        "title": `As a user,
I want the system to recommend content based on my preferences,
so that I can discover relevant information faster.`,
        "status": "backlog",
        "id": "202504-031241-01251-6599d856",
    },
    "202504-031241-27956-226322f2": {
        "title": `As a developer,
I want to monitor AI model performance,
so that I can detect and improve low-accuracy results.`,
        "status": "backlog",
        "id": "202504-031241-27956-226322f2"
    },
    "202504-031242-05649-15828e7e": {
        "title": `As a product manager,
I want the AI system to explain why it made a recommendation,
so that users trust the suggestions.`,
        "status": "todo",
        "id": "202504-031242-05649-15828e7e"
    },

    "202504-031231-01251-6599d856": {
        "title": `As a new user,
I want to set my preferences during onboarding,
so that the AI can start personalizing from day one.`,
        "status": "todo",
        "id": "202504-031231-01251-6599d856",
    },
    "202504-031231-27956-226322f2": {
        "title": `As a new user,
I want to set my preferences during onboarding,
so that the AI can start personalizing from day one.`,
        "status": "backlog",
        "id": "202504-031231-27956-226322f2"
    },
    "202504-031232-05649-15828e7e": {
        "title": `As a new user,
I want to set my preferences during onboarding,
so that the AI can start personalizing from day one.`,
        "status": "in-progress",
        "id": "202504-031232-05649-15828e7e"
    },
    "202504-032232-05649-15828e7e": {
        "title": `As a developer,
I want to retrain the AI model regularly,
so that it stays up-to-date with new data.`,
        "status": "testing",
        "id": "202504-032232-05649-15828e7e"
    },
    "202504-031132-05649-15828e7e": {
        "title": `As a user,
I want to give feedback on AI recommendations,
so that the system can learn and improve.`,
        "status": "in-progress",
        "id": "202504-031132-05649-15828e7e"
    }
}

const ticketsAPI = AutoAPI({
    modelName: name,
    modelType: Objects.tickets,
    initialData: initialData,
    prefix: prefix,
    skipDatabaseIndexes: true,
    onBeforeCreate: async (data, session?, req?) => {
        return {
            ...data,
            lastEditor: session?.user?.id,
        }
    },
    onBeforeUpdate: async (data, req?, session?) => {
        return {
            ...data,
            lastEditor: session?.user?.id,
        }
    },
    transformers: {
        finishedAtCheck: async (field, e, data, prevData, b) => {
            if (data.status == "done" && !data.finishedAt) {
                data.finishedAt = moment().toDate()
            } else if (data.status != "done") {
                delete data.finishedAt
            }

            const editorId = data.lastEditor
            delete data.lastEditor

            if (editorId) {
                if (e.eventName == "create") {
                    if (!data.id) {
                        data.id = moment().format('YYYYMM-DDHHmm-ssSSS') + '-' + uuidv4().split('-')[0]
                    }
                    await API.post("/api/v1/activityLogs", {
                        ticketId: data.id,
                        userId: editorId,
                        type: "create",
                        payload: data
                    })
                }
                if (e.eventName == "update") {
                    const changedData = Object.keys(data).reduce((acc, key) => {
                        let isEqual = false
                        try {
                            isEqual = JSON.stringify(data[key]) === JSON.stringify(prevData[key])
                        } catch (e) { }
                        if (!isEqual) {
                            acc[key] = { prev: prevData[key], current: data[key] }
                        }
                        return acc
                    }, {})

                    if (Object.keys(changedData).length > 0) {
                        await API.post("/api/v1/activityLogs", {
                            ticketId: data.id,
                            payload: {
                                data: data,
                                changes: changedData
                            },
                            userId: editorId,
                            type: "update"
                        })
                    }
                }
            }
            return data
        }
    }
})

const ticketsActions = AutoActions({
    modelName: name,
    modelType: Objects.tickets,
    prefix: prefix
})

export default Protofy("code", async (app: Application, context: typeof APIContext) => {
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