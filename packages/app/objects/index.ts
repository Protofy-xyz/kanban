import {Protofy} from 'protobase'
import { TicketsModel } from "./tickets";
import { TagsModel } from "./tags";
import { ActivityLogsModel } from "./activityLogs";

export default Protofy("objects", {
    tickets: TicketsModel,
    tags: TagsModel,
    activityLogs: ActivityLogsModel
})