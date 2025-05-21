import { Checkbox, Popover, XStack, Text, Input, YStack } from "@my/ui"
import { Check, ChevronDown } from "@tamagui/lucide-icons"
import { useState } from "react"

export const MultiSelectListPopover = ({ list, values, onToggle, triggerProps = {} }) => {
    const [menuOpened, setMenuOpened] = useState(false)
    const [search, setSearch] = useState("")

    list = list?.filter((item) => {
        if (search == "") return true
        if (item.toLowerCase().includes(search.toLowerCase())) return true
        return false
    })

    return <XStack overflowX='scroll' w='100%' ai="center" gap="$2">
        <Popover onOpenChange={setMenuOpened} open={menuOpened} allowFlip >
            <XStack gap="$2" w="100%" ai="center" onMouseDown={e => e.stopPropagation()}>
                <Popover.Trigger w="100%" asChild>
                    <YStack cursor="pointer" w="100%" p="$2" pl="$3" pr="$5" bc="$background" bw="$0.5" br="$3" {...triggerProps}>
                        <Text fos="$4" numberOfLines={1}>
                            {
                                values.length > 0 ? values.join(", ") : "Select tags"
                            }
                        </Text>
                        <ChevronDown size={13} pos="absolute" r={12} t={12} />
                    </YStack>
                </Popover.Trigger>
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
                    placeholder="Search..."
                    value={search}
                    onChangeText={setSearch}
                    w="100%"
                    backgroundColor="$backgroundHover"
                    borderWidth={1}
                    borderColor="$borderColor"
                    mb="$2"
                    br="$2"
                    onKeyPress={(e) => {
                        if (e.key == "Enter" && list?.length > 0) {
                            onToggle(list[0])
                        }
                    }}
                />
                <YStack f={1} overflowY="scroll" h={250} gap="$2" >
                    {
                        list.map((option, index) => {
                            return <XStack
                                key={index}
                                w="100%"
                                ai="center"
                                gap="$2"
                                onPress={() => onToggle(option)}
                                cursor='pointer'
                                p="$2"
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--backgroundHover)"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                                <Checkbox id={option} size="$4" checked={values.some(t => t == option)}>
                                    <Checkbox.Indicator>
                                        <Check />
                                    </Checkbox.Indicator>
                                </Checkbox>
                                <XStack br="$20" p="$1" px="$3" >
                                    <Text>{option}</Text>
                                </XStack>
                            </XStack>
                        })
                    }
                </YStack>
            </Popover.Content>
        </Popover>
    </XStack >
}