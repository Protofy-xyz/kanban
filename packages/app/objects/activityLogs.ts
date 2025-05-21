import moment from 'moment'
import { Protofy, Schema, BaseSchema, getLogger, ProtoModel, SessionDataType, z } from 'protobase'

const logger = getLogger()
Protofy("features", {
    "AutoAPI": true,
    "adminPage": "/activityLogs"
})

export const BaseActivityLogsSchema = Schema.object(Protofy("schema", {
    ticketId: z.string(),
    userId: z.string(),
    message: z.string().optional(),
    payload: z.record(z.any()).optional(),
    createdAt: z.date().datePicker().generate((obj) => moment().toDate()).search().hidden().indexed(),
    type: z.union([
        z.literal("create"),
        z.literal("comment"),
        z.literal("update")
    ]).defaultValue("comment"),
}))

//check if any of the fields of the schema has set the id flag
const hasId = Object.keys(BaseActivityLogsSchema.shape).some(key => BaseActivityLogsSchema.shape[key]._def.id)

export const ActivityLogsSchema = Schema.object({
    ...(!hasId ? BaseSchema.shape : {}),
    ...BaseActivityLogsSchema.shape
});

export type ActivityLogsType = z.infer<typeof ActivityLogsSchema>;

export class ActivityLogsModel extends ProtoModel<ActivityLogsModel> {
    constructor(data: ActivityLogsType, session?: SessionDataType,) {
        super(data, ActivityLogsSchema, session, "ActivityLogs");
    }

    public static getApiOptions() {
        return Protofy("api", {
            "name": 'activitylogs',
            "prefix": '/api/v1/'
        })
    }

    create(data?): ActivityLogsModel {
        const result = super.create(data)
        return result
    }

    read(extraData?): ActivityLogsType {
        const result = super.read(extraData)
        return result
    }

    update(updatedModel: ActivityLogsModel, data?: ActivityLogsType): ActivityLogsModel {
        const result = super.update(updatedModel, data)
        return result
    }

    list(search?, session?, extraData?, params?): ActivityLogsType[] {
        const result = super.list(search, session, extraData, params)
        return result
    }

    delete(data?): ActivityLogsModel {
        const result = super.delete(data)
        return result
    }

    protected static _newInstance(data: any, session?: SessionDataType): ActivityLogsModel {
        return new ActivityLogsModel(data, session);
    }

    static load(data: any, session?: SessionDataType): ActivityLogsModel {
        return this._newInstance(data, session);
    }
}
