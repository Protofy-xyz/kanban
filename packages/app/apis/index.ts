import {Protofy} from 'protobase'
import ticketsApi from "./tickets";

const autoApis = Protofy("apis", {
    tickets: ticketsApi
})

export default (app, context) => {
    Object.keys(autoApis).forEach((k) => {
        autoApis[k](app, context)
    })
}