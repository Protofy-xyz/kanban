import { Button, Checkbox, Popover, XStack, Text, Input, YStack } from "@my/ui"
import { Check, Plus, X } from "@tamagui/lucide-icons"
import { Chip } from "protolib/components/Chip"
import { useState } from "react"

export const TicketsTagsSelect = ({ data, setData, tagsList }) => {
    const [menuOpened, setMenuOpened] = useState(false)
    const [search, setSearch] = useState("")
    data = data && data != "" ? data : []

    const onTagSelect = (tag) => {
        const newTags = data.some(t => t.name == tag.name) ? data.filter(t => t.name != tag.name) : [...data, tag]
        setData(newTags)
    }

    tagsList = tagsList?.filter((project) => {
        if (search == "") return true
        if (project.name.toLowerCase().includes(search.toLowerCase())) return true
        return false
    })

    return <XStack overflowX='scroll' w='100%' ai="center" gap="$2">
        <Popover onOpenChange={setMenuOpened} open={menuOpened} allowFlip >
            <XStack gap="$2" w="100%" ai="center" onMouseDown={e => e.stopPropagation()}>
                <Popover.Trigger asChild>
                    {
                        <Button icon={Plus} w="50px" h="$2" br="$10"></Button>
                    }
                </Popover.Trigger>
                {
                    data.map((tag, index) => {
                        return <Button key={tag.name} h="$2" br="$10" bc={tag.color} ai="center" onPress={() => onTagSelect(tag)} >
                            {tag.name}
                            <X mt="2px" size={14} />
                        </Button>
                    })
                }
            </XStack>
            <Popover.Content
                borderWidth={1}
                borderColor="$borderColor"
                w={250}
                p="$2"
                backgroundColor={"$backgroundStrong"}
                enterStyle={{ y: -10, opacity: 0 }}
                exitStyle={{ y: -10, opacity: 0 }}
                flexDirection="row"
                flexWrap="wrap"
                gap="$2"
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
                <Input
                    placeholder="Search tag..."
                    value={search}
                    onChangeText={setSearch}
                    w="100%"
                    backgroundColor="$backgroundHover"
                    borderWidth={1}
                    borderColor="$borderColor"
                    mb="$2"
                    br="$2"
                    onKeyPress={(e) => {
                        if (e.key == "Enter" && tagsList?.length > 0) {
                            onTagSelect(tagsList[0])
                        }
                    }}
                />
                <YStack f={1} overflowY="scroll" h={250} gap="$2" >
                    {
                        tagsList.map((tag, index) => {
                            return <XStack key={index} w="100%" ai="center" gap="$4" onPress={() => onTagSelect(tag)} cursor='pointer' p="$2" hoverStyle={{ backgroundColor: "$backgroundHover" }}>
                                <Checkbox id={tag.name} size="$4" checked={data.some(t => t.name == tag.name)}>
                                    <Checkbox.Indicator>
                                        <Check />
                                    </Checkbox.Indicator>
                                </Checkbox>
                                <XStack br="$20" p="$1" px="$3" backgroundColor={tag.color ?? "$gray6"} >
                                    <Text>{tag.name}</Text>
                                </XStack>
                            </XStack>
                        })
                    }
                </YStack>
            </Popover.Content>
        </Popover>
    </XStack >
}