import {Protofy} from 'protobase'
import { TicketsModel } from "./tickets";
import { TagsModel } from "./tags";

export default Protofy("objects", {
    tickets: TicketsModel,
    tags: TagsModel
})