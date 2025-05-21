import {Protofy} from 'protobase'
import ticketsApi from "./tickets";
import tagsApi from "./tags";
import activityLogsApi from "./activityLogs";

const autoApis = Protofy("apis", {
    tickets: ticketsApi,
    tags: tagsApi,
    activityLogs: activityLogsApi
})

export default (app, context) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app, context)
    })
}