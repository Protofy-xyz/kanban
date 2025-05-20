import { useState } from 'react'
import { Protofy, API } from 'protobase'
import { PaginatedDataSSR } from 'protolib/lib/SSR'
import { Objects } from '../bundles/objects'
import { DataView } from 'protolib/components/DataView'
import { AdminPage } from 'protolib/components/AdminPage'
import { Tag } from '@tamagui/lucide-icons'
import { context } from '../bundles/uiContext'
import { useRouter } from 'solito/navigation'
import { EditableText } from 'app/components/ContentEditable'
import { TicketsModel } from 'app/objects/tickets'
import { Button, Text, TextArea, useToastController, XStack, Circle } from '@my/ui'
import { Tinted } from 'protolib/components/Tinted'

const Icons = {}
const isProtected = Protofy("protected", true)
const permissions = isProtected ? Protofy("permissions", ["admin"]) : null
const { name, prefix } = Objects.tickets.getApiOptions()
const apiUrl = prefix + name

Protofy("object", "tickets")
Protofy("pageType", "admin")

const textComponent = ({ placeholder = "Text here", ...props }) => (path, data, setData, mode, originalData, setFormData) => {
    const [initialText, setInitialText] = useState(data)

    return <Text fos="$4" fow="400" f={1} {...props}>
        <EditableText
            style={{ boxShadow: "0px 0px 0px 0px var(--color)", flex: 1, padding: "8px" }}
            placeholder={placeholder}
            placeholderStyle={{ fontWeight: "500" }}
            onFocus={e => {
                e.currentTarget.style.boxShadow = "0px 0px 0px 1px var(--color)"
                e.currentTarget.style.borderRadius = "5px"
            }}
            onBlur={e => {
                const newText = e.target.textContent
                if (!newText || !(newText.length > 0)) {
                    setData(initialText)
                } else {
                    setInitialText(newText)
                    setData(newText)
                }
                e.currentTarget.style.boxShadow = "0px 0px 0px 0px var(--color)"
            }}
            editable={true}
            onChange={e => setData(e.target.value)}
        >
            {data ?? ''}
        </EditableText>
    </Text>
}

export default {
    route: Protofy("route", "/admin/tickets"),
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
        return (<AdminPage title="Tickets" pageSession={pageSession}>
            <DataView
                rowIcon={Tag}
                sourceUrl={apiUrl}
                initialItems={initialItems}
                numColumnsForm={2}
                name="Tickets"
                model={Objects.tickets}
                defaultView='sequence'
                disableViews={["grid", "raw"]}
                pageState={pageState}
                icons={Icons}
                hideFilters={false}
                customFieldsForms={{
                    "title": {
                        hideLabel: true,
                        component: textComponent({ placeholder: "Title here...", fos: "$6", fow: "600" })
                    },
                    "description": {
                        hideLabel: false,
                        component: textComponent({ placeholder: "Description here..." })
                    },
                    "status": {
                        hideLabel: true,
                        component: (path, data, setData, mode, originalData, setFormData) => {
                            const onArchive = () => {
                                setFormData("archived", !originalData.archived)
                            }

                            return <XStack jc="space-between" ai="center" f={1}>
                                <XStack gap="$2" ai="center" f={1}>
                                    {TicketsModel.getStatusList().map((status) => <Tinted tint={TicketsModel.getStatusTheme(status) ?? "gray"}>
                                        <Button
                                            size="$1"
                                            br="100px"
                                            hoverStyle={{ elevation: 5, scale: 1.01 }} pressStyle={{ elevation: 0.01 }}
                                            onPress={() => setData(status)}
                                            bc={data == status ? "$color6" : "transparent"}
                                            gap="$0"
                                            px="$2"
                                        >
                                            <Circle size={10} bc={"$color8"} />{status}
                                        </Button></Tinted>)}
                                </XStack>
                            </XStack>
                        }
                    }
                }}
            />
        </AdminPage>)
    }
}