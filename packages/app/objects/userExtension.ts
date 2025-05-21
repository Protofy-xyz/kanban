import { Protofy, Schema, BaseSchema, getLogger, ProtoModel, UserModel, SessionDataType, z } from 'protobase'

const logger = getLogger()

export const BaseUsersExtensionSchema = Schema.object(Protofy("schema", {
    username: z.string().id(),
}))

export const UsersExtensionSchema = Schema.object({
    ...BaseUsersExtensionSchema.shape
});

export type UserExtensionType = z.infer<typeof UsersExtensionSchema>;

export class UserExtensionModel extends ProtoModel<UserExtensionModel> {
    constructor(data: UserExtensionType, session?: SessionDataType,) {
        super(data, UsersExtensionSchema, session, "Clients");
    }

    public static getApiOptions() {
        return Protofy("api", {
            "name": 'accounts',
            "prefix": '/api/core/v1/'
        })
    }

    create(data?): UserExtensionModel {
        const result = super.create(data)
        return result
    }

    read(extraData?): UserExtensionType {
        const result = super.read(extraData)
        return result
    }

    update(updatedModel: UserExtensionModel, data?: UserExtensionType): UserExtensionModel {
        const result = super.update(updatedModel, data)
        return result
    }

    list(search?, session?, extraData?, params?): UserExtensionType[] {
        const result = super.list(search, session, extraData, params)
        return result
    }

    delete(data?): UserExtensionModel {
        const result = super.delete(data)
        return result
    }

    protected static _newInstance(data: any, session?: SessionDataType): UserExtensionModel {
        return new UserExtensionModel(data, session);
    }

    static load(data: any, session?: SessionDataType): UserExtensionModel {
        return this._newInstance(data, session);
    }
}
