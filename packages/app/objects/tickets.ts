import { Protofy, Schema, BaseSchema, getLogger, ProtoModel, SessionDataType, z  } from 'protobase'
import moment from 'moment';

const logger = getLogger()
Protofy("features", {
    "AutoAPI": true,
    "adminPage": "/tickets",
    "undefinedPage": "/admin/tickets"
})

export const BaseTicketsSchema = Schema.object(Protofy("schema", {
	status: z.union([
        z.literal("backlog"),
        z.literal("todo"),
        z.literal("in-progress"),
        z.literal("impeded"),
        z.literal("testing"),
        z.literal("done")
    ]).defaultValue("backlog").onCreate('finishedAtCheck').onUpdate('finishedAtCheck').size(2).sequence(),
    title: z.string().size(2).search(),
    description: z.string().textArea(150).optional().size(2).search(),
    points: z.number().optional(),
    priority: z.union([z.literal("low"), z.literal("medium"), z.literal("high"), z.literal("urgent")]).optional(),
    createdAt: z.date().datePicker().generate((obj) => moment().toDate()).search().hidden().indexed(),
    finishedAt: z.date().datePicker().optional().hidden(),
    archived: z.boolean().optional().hidden().indexed(),
}))

//check if any of the fields of the schema has set the id flag
const hasId = Object.keys(BaseTicketsSchema.shape).some(key => BaseTicketsSchema.shape[key]._def.id)

export const TicketsSchema = Schema.object({
    ...(!hasId? BaseSchema.shape : {}),
    ...BaseTicketsSchema.shape
});

export type TicketsType = z.infer<typeof TicketsSchema>;

export class TicketsModel extends ProtoModel<TicketsModel> {
    constructor(data: TicketsType, session?: SessionDataType, ) {
        super(data, TicketsSchema, session, "Tickets");
    }

    public static getApiOptions() {
        return Protofy("api", {
            "name": 'tickets',
            "prefix": '/api/v1/'
        })
    }

    create(data?):TicketsModel {
        const result = super.create(data)
        return result
    }

    read(extraData?): TicketsType {
        const result = super.read(extraData)
        return result
    }

    update(updatedModel: TicketsModel, data?: TicketsType): TicketsModel {
        const result = super.update(updatedModel, data)
        return result
    }

	list(search?, session?, extraData?, params?): TicketsType[] {
        const result = super.list(search, session, extraData, params)
        return result
    }

    delete(data?): TicketsModel {
        const result = super.delete(data)
        return result
    }

    protected static _newInstance(data: any, session?: SessionDataType): TicketsModel {
        return new TicketsModel(data, session);
    }

    static load(data: any, session?: SessionDataType): TicketsModel {
        return this._newInstance(data, session);
    }
}
