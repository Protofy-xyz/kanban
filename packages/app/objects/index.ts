import {Protofy} from 'protobase'
import { TicketsModel } from "./tickets";

export default Protofy("objects", {
    tickets: TicketsModel
})