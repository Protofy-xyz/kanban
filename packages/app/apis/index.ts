import {Protofy} from 'protobase'
import ticketsApi from "./tickets";
import tagsApi from "./tags";

const autoApis = Protofy("apis", {
    tickets: ticketsApi,
    tags: tagsApi
})

export default (app, context) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app, context)
    })
}