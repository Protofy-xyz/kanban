import { API } from 'protobase'
import { Button, XStack, Input, YStack, Popover, Tooltip, Text } from '@my/ui'
import { Tinted } from 'protolib/components/Tinted'
import { CollaboratorImage } from 'app/components/CollaboratorImage'
import { useState } from 'react'
import { useSession } from 'protolib/lib/useSession'
import { ActivityLogsModel } from 'app/objects/activityLogs'
import { useRemoteStateList } from 'protolib/lib/useRemoteState';
import moment from 'moment'

function addsAndToLast(str) {
    const partes = str.split(',').map(s => s.trim());
    if (partes.length <= 1) return str;
    return partes.slice(0, -1).join(', ') + ' & ' + partes.slice(-1);
}

export const LogCard = ({ activity, currentUser }) => {
    const isCurrentUser = activity.userId === currentUser
    const [menuOpened, setMenuOpened] = useState("")

    return <Tinted>
        <YStack f={1} gap="$1">
            {
                activity.type == "comment"
                && <XStack gap="$2" ai="center" br="$3" bg="$gray4" p="$3">
                    <Text fontSize="$4" color="$gray12" fow="400">{activity.message}</Text>
                </XStack>
            }
            {
                activity.type == "update"
                && <Tooltip>
                    <Tooltip.Trigger>
                        <XStack ai="center" br="$3" pl="$2" pt="$1">
                            <Text fontSize="$4" color="$gray12" fow="400">{`${activity.userId} has updated ${addsAndToLast(Object.keys(activity?.payload?.changes).join(", "))}`}</Text>
                        </XStack>
                    </Tooltip.Trigger>
                    <Tooltip.Content
                        enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
                        exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
                        scale={1}
                        x={0}
                        y={0}
                        opacity={1}
                        zIndex={9999999999}
                        animation={[
                            'quick',
                            {
                                opacity: {
                                    overshootClamping: true,
                                },
                            },
                        ]}
                    >
                        <Text>{JSON.stringify(activity?.payload?.changes)}</Text>
                    </Tooltip.Content>
                </Tooltip>
            }
            {
                activity.type == "create"
                && <XStack ai="center" br="$3" pl="$2" pt="$1">
                    <Text fontSize="$4" color="$gray12" fow="400">{`${activity.userId} added this card to ${activity?.payload?.status}`}</Text>
                </XStack>
            }
            <XStack h="20px" ai="center">
                <Text ml="$2" fontSize="$2" color="$gray9">{moment(activity.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                {isCurrentUser && activity.type == "comment" && <>
                    <Text ml="$2" color="$gray9">·</Text>
                    <XStack ai="center">
                        <Popover onOpenChange={(val) => setMenuOpened(val ? activity.id : "")} open={menuOpened == activity.id} allowFlip >
                            <Popover.Trigger f={1} asChild>
                                <Button
                                    bc="transparent"
                                    color="$gray9"
                                    hoverStyle={{ backgroundColor: "transarent", textDecorationLine: 'underline' }}
                                    size="$2"
                                >
                                    Delete
                                </Button>
                            </Popover.Trigger>
                            <Popover.Content
                                borderWidth={1}
                                borderColor="$borderColor"
                                w={250}
                                p="$3"
                                backgroundColor={"$backgroundStrong"}
                                enterStyle={{ y: -10, opacity: 0 }}
                                exitStyle={{ y: -10, opacity: 0 }}
                                elevate
                                animation={[
                                    'quick',
                                    {
                                        opacity: {
                                            overshootClamping: true,
                                        },
                                    },
                                ]}
                                zIndex={9999999999}
                            >
                                <Text fos="$3" fow="600">Are you sure?</Text>
                                <Text fos="$3" ta="left" w="100%" mb="$3" color="$gray9">This action cannot be undone.</Text>
                                <Tinted tint="red">
                                    <Button
                                        bc="$color8"
                                        color="$backgroundStrong"
                                        fow="400"
                                        hoverStyle={{ backgroundColor: "$color9" }}
                                        size="$3"
                                        w="100%"
                                        onPress={async () => {
                                            await API.get("/api/v1/activityLogs/" + activity.id + "/delete")
                                        }}>
                                        Delete comment
                                    </Button>
                                </Tinted>
                            </Popover.Content>
                        </Popover>
                    </XStack>
                </>}
            </XStack>
        </YStack>
    </Tinted>
}

export const ActivityLogs = ({ pageSession, ticketId, ticket = {} }) => {
    const [message, setMessage] = useState("")
    const [session] = useSession(pageSession)
    const currentUser = session.user.id

    const defaultFetchFunc = async (fn: Function) => {
        const response = await API.get("/api/v1/activityLogs?filter[ticketId]=" + ticketId);
        fn(response);
    };

    const [data] = useRemoteStateList(undefined, defaultFetchFunc, ActivityLogsModel.getNotificationsTopic(), ActivityLogsModel, true);
    const activityData = data?.data?.items || []

    activityData?.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    const onSave = async () => {
        if (message.length > 0) {
            await API.post("/api/v1/activityLogs", {
                ticketId: ticketId,
                payload: ticket,
                message: message,
                userId: currentUser,
                type: "comment"
            })
            setMessage("")
        }
    }


    return <YStack f={1}>
        <XStack gap="$2" f={1} mb="$5">
            <CollaboratorImage containerStyle={{ paddingTop: "5px" }} username={currentUser} size={30} />
            <XStack f={1} gap="$2">
                <Input
                    placeholder="Activity here..."
                    value={message}
                    onChangeText={setMessage}
                    br="$3"
                    size="$3"
                    h={40}
                    w="100%"
                />
                <Tinted>
                    <Button
                        size="$3"
                        h={40}
                        disabled={message.length > 1 ? false : true}
                        als="flex-start"
                        bc={message.length > 1 ? "$color7" : "$gray8"}
                        onPress={onSave}
                        hoverStyle={{ backgroundColor: "$color8" }}
                        color="$color1"
                    >
                        Add
                    </Button>
                </Tinted>
            </XStack>
        </XStack>
        <YStack gap="$3" maxHeight={300} overflow='auto' pb="$5">
            {
                activityData.map((activity, i) => {
                    return <XStack key={activity.id} gap="$2">
                        <CollaboratorImage containerStyle={{ paddingTop: "8px" }} username={activity.userId} size={30} />
                        <LogCard activity={activity} currentUser={currentUser} />
                    </XStack>
                })
            }
        </YStack>
    </YStack>
}