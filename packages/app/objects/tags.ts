import { Protofy, Schema, BaseSchema, getLogger, ProtoModel, SessionDataType, z  } from 'protobase'

const logger = getLogger()
Protofy("features", {
    "AutoAPI": true,
    "adminPage": "/tags"
})

export const BaseTagsSchema = Schema.object(Protofy("schema", {
    name: z.string().search(),
    color: z.string().color().defaultValue("#dbdbdb").optional()
}))

//check if any of the fields of the schema has set the id flag
const hasId = Object.keys(BaseTagsSchema.shape).some(key => BaseTagsSchema.shape[key]._def.id)

export const TagsSchema = Schema.object({
    ...(!hasId? BaseSchema.shape : {}),
    ...BaseTagsSchema.shape
});

export type TagsType = z.infer<typeof TagsSchema>;

export class TagsModel extends ProtoModel<TagsModel> {
    constructor(data: TagsType, session?: SessionDataType, ) {
        super(data, TagsSchema, session, "Tags");
    }

    public static getApiOptions() {
        return Protofy("api", {
            "name": 'tags',
            "prefix": '/api/v1/'
        })
    }

    create(data?):TagsModel {
        const result = super.create(data)
        return result
    }

    read(extraData?): TagsType {
        const result = super.read(extraData)
        return result
    }

    update(updatedModel: TagsModel, data?: TagsType): TagsModel {
        const result = super.update(updatedModel, data)
        return result
    }

	list(search?, session?, extraData?, params?): TagsType[] {
        const result = super.list(search, session, extraData, params)
        return result
    }

    delete(data?): TagsModel {
        const result = super.delete(data)
        return result
    }

    protected static _newInstance(data: any, session?: SessionDataType): TagsModel {
        return new TagsModel(data, session);
    }

    static load(data: any, session?: SessionDataType): TagsModel {
        return this._newInstance(data, session);
    }
}
