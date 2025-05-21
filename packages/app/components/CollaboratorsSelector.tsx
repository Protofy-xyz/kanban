import { Button, Checkbox, Popover, XStack, Text, YStack, Input } from "@my/ui"
import { Check, Plus, Trash } from "@tamagui/lucide-icons"
import { Chip } from "protolib/components/Chip"
import { useState } from "react"
import { CollaboratorImage } from 'app/components/CollaboratorImage'

export const CollaboratorsSelector = ({ data, setData, list }) => {
    const [menuOpened, setMenuOpened] = useState(false)
    const [selectedCollaborator, setSelectedCollaborator] = useState(null)
    const [search, setSearch] = useState("")

    data = data && data != "" ? data : []

    const onCollabSelect = (col) => {
        let newCollabs
        if (!col) {
            newCollabs = data.filter(t => t.id)
        } else {
            newCollabs = data.some(t => t.id?.username == col.username) ? data.filter(t => t.id?.username != col.username) : [...data, { id: col }]
        }
        setData(newCollabs)
        setSearch("")
    }

    list = list?.filter((account) => {
        if (search == "") return true
        if (account?.username.toLowerCase().includes(search.toLowerCase())) return true
        return false
    })

    return <XStack overflowX='scroll' w='100%' ai="center" gap="$2">
        <Popover onOpenChange={setMenuOpened} open={menuOpened} allowFlip>
            <XStack gap="$2" p="$2" onMouseDown={e => e.stopPropagation()}>
                <Popover.Trigger asChild>
                    {
                        <Button icon={Plus} circular onPress={() => setSelectedCollaborator(null)}></Button>
                    }
                </Popover.Trigger>
                {
                    data.map((collaborator, index) => {
                        return <Popover.Trigger asChild>
                            <YStack cursor="pointer" onPress={() => setSelectedCollaborator(collaborator)} key={collaborator?.id?.username ?? index} hoverStyle={{ scale: 1.04 }}>
                                <CollaboratorImage username={collaborator?.id?.username} size="44px" />
                                {collaborator?.weight ? <YStack w="20px" h="20px" jc="center" ac="center" pos="absolute" br="100px" backgroundColor="$blue9" top={-5} right={-5}>
                                    <Text fontSize="$2" color="$backgroundStrong" fontWeight="500" ta="center">{collaborator?.weight}</Text>
                                </YStack> : null}

                            </YStack>
                        </Popover.Trigger>
                    })
                }
            </XStack>
            <Popover.Content
                borderWidth={1}
                borderColor="$borderColor"
                width={350}
                maxHeight={400}
                p="$0"
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
                {
                    selectedCollaborator
                        ? <XStack p="$3" gap="$4" jc="flex-start" f={1} w="100%" ai="center">
                            <Button
                                theme="red"
                                backgroundColor="$red9"
                                color="$backgroundStrong"
                                hoverStyle={{ backgroundColor: "$red10" }}
                                icon={Trash}
                                circular
                                onPress={() => {
                                    onCollabSelect(selectedCollaborator.id)
                                    setMenuOpened(false)
                                }}
                                zIndex={9999}
                                pos="absolute"
                                size="$3"
                                top={10}
                                right={15}
                            />
                            <CollaboratorImage key={selectedCollaborator.id?.username} username={selectedCollaborator.id?.username} size="100px" />
                            <YStack f={1}>
                                <Text fow="600" fos="$3">Weight:</Text>
                                <Text fow="400" fos="$3" mb="$2" color="$color9">Relevance on the process</Text>
                                <Input
                                    value={data.find(t => t.id?.username == selectedCollaborator.id?.username)?.weight ?? ""}
                                    maxLength={2}
                                    inputMode="numeric"
                                    h="40px"
                                    fos="$8"
                                    ta="center"
                                    mr="$0"
                                    onChangeText={(text) => {
                                        // weight is a number, so we need to parse it
                                        const weight = text.replace(/[^0-9.-]/g, '')
                                        if (weight == "") {
                                            const newCollabs = data.map(t => t.id?.username == selectedCollaborator.id?.username ? { ...t, weight: undefined } : t)
                                            setData(newCollabs)
                                            return;
                                        }
                                        const numericValue = parseFloat(weight) ?? 0;
                                        if (isNaN(numericValue)) {
                                            return;
                                        }
                                        const newCollabs = data.map(t => t.id?.username == selectedCollaborator.id?.username ? { ...t, weight: numericValue } : t)
                                        setData(newCollabs)
                                        console.log("DEV: newCollabs: ", newCollabs)
                                    }}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    f={1}
                                    borderWidth={1}
                                    borderColor="$borderColor"
                                    br="$2"
                                    px="$2"
                                    py="$1"
                                />
                            </YStack>
                        </XStack>
                        : <YStack p="$3" w="100%">
                            <Input
                                placeholder="Search protofier..."
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
                                        onCollabSelect(list[0])
                                    }
                                }}
                            />
                            <YStack f={1} overflowY="scroll" h={350} gap="$2" >
                                {list?.map((account, index) => {
                                    return <XStack key={account.username} w="100%" ai="center" gap="$4" p="$2" onPress={() => onCollabSelect(account)} cursor="pointer" hoverStyle={{ backgroundColor: "$backgroundHover" }}>
                                        <Checkbox id={account?.username} size="$4" checked={data.some(t => t.id?.username == account?.username)} onCheckedChange={() => onCollabSelect(account)}>
                                            <Checkbox.Indicator>
                                                <Check />
                                            </Checkbox.Indicator>
                                        </Checkbox>
                                        <XStack gap="$2" ai="center" f={1} overflow="hidden">
                                            <CollaboratorImage key={account.username} username={account.username} size="44px" />
                                            <Text>{account.username}</Text>
                                        </XStack>
                                    </XStack>
                                })}
                            </YStack>
                        </YStack>
                }
            </Popover.Content>
        </Popover>
    </XStack>
}