import { Protofy, Schema, BaseSchema, getLogger, ProtoModel, SessionDataType, z } from 'protobase'
import moment from 'moment';
import { TagsModel } from './tags';
import { UserExtensionModel } from './userExtension';

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
    tags: z.array(TagsModel.linkTo(data => data.name)).optional().size(2),
    description: z.string().textArea(150).optional().size(2).search(),
    collaborators: z.array(z.object({
        id: UserExtensionModel.linkTo(data => data.username).label("id"),
        weight: z.number().label("weight (amount of work)").optional(),
    }).displayOptions({ defaultOpen: true })).optional().displayOptions({ defaultOpen: true }),
    points: z.number().optional(),
    priority: z.union([z.literal("low"), z.literal("medium"), z.literal("high"), z.literal("urgent")]).optional(),
    createdAt: z.date().datePicker().generate((obj) => moment().toDate()).search().hidden().indexed(),
    finishedAt: z.date().datePicker().optional().hidden()
}))

//check if any of the fields of the schema has set the id flag
const hasId = Object.keys(BaseTicketsSchema.shape).some(key => BaseTicketsSchema.shape[key]._def.id)

export const TicketsSchema = Schema.object({
    ...(!hasId ? BaseSchema.shape : {}),
    ...BaseTicketsSchema.shape
});

export type TicketsType = z.infer<typeof TicketsSchema>;

export class TicketsModel extends ProtoModel<TicketsModel> {
    constructor(data: TicketsType, session?: SessionDataType,) {
        super(data, TicketsSchema, session, "Tickets");
    }

    public static getApiOptions() {
        return Protofy("api", {
            "name": 'tickets',
            "prefix": '/api/v1/'
        })
    }

    create(data?): TicketsModel {
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
        if (!result)  return

        if (params?.tags) {
            const paramsTags = params?.tags.split(",")
            const ticketHasTag = result?.tags?.some((tag) => paramsTags.includes(tag.name))
            if (!ticketHasTag) {
                return
            }
        }

        if (params?.collaborator) {
            const currentCollaborator = params?.collaborator
            const collabOnThisTicket = result?.collaborators?.find((collab) => collab.id?.username === currentCollaborator)
            if (!collabOnThisTicket) {
                return
            }
        }

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

    static getPriorityIcon(priority: string) {
        switch (priority) {
            case "low":
                return "💧"
            case "medium":
                return "🔥"
            case "high":
                return "🔥🔥"
            case "urgent":
                return "🚨"
            default:
                return "❔"
        }
    }

    getPriorityIcon() {
        return TicketsModel.getPriorityIcon(this.get('priority'))
    }

    static getFibonacciList(): number[] {
        return [1, 2, 3, 5, 8, 13]
    }

    static getPriorityList(): string[] {
        return this.getObjectSchema().getFieldDefinition("priority").innerType.options?.map(
            (option: z.ZodLiteral<string>) => option.value
        );
    }

    static getStatusList(): string[] {
        return this.getObjectSchema().getFieldDefinition("status").options?.map(
            (option: z.ZodLiteral<string>) => option.value
        );
    }

    static getStatusTheme(status: string) {
        switch (status) {
            case "todo":
                return "blue"
            case "impeded":
                return "red"
            case "in-progress":
                return "yellow"
            case "testing":
                return "orange"
            case "done":
                return "green"
            case "backlog":
            default:
                return undefined
        }
    }
}
