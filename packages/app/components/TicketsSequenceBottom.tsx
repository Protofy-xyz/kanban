import { Button, TextArea, XStack } from "@my/ui"
import { Plus, X } from "@tamagui/lucide-icons"
import { useRef, useState } from "react"

export const TicketsSequenceBottom = ({ stage, onCreate, cardVisible, onChangeCardVisible }) => {
    const [ticketTitle, setTicketTitle] = useState('')
    const cancelingRef = useRef(false);

    if (stage == "done") return <></>
    return <>
        {
            cardVisible &&
            <TextArea
                autoFocus
                w={"250px"}
                minHeight={60}
                mb="$2"
                p="$2"
                pt="$2"
                mt="$3"
                br="$4"
                bc="$backgroundStrong"
                boc="$gray4"
                bw="$0.5"
                placeholder="Add title here..."
                onBlur={e => {
                    if (!cancelingRef.current && e.target?.value !== "") {
                        onCreate(ticketTitle, stage);
                    }
                }}
                onChangeText={setTicketTitle}
                onKeyPress={(e) => {
                    if (e.key == "Enter" && !e.shiftKey) {
                        e.preventDefault()
                      onCreate(ticketTitle, stage);
                    }
                  }}
            />
        }
        {
            cardVisible
                ? <XStack gap="$2">
                    <Button size="$3" jc="flex-start" bc="$color7">Add ticket</Button>
                    <Button
                        size="$3"
                        onMouseDown={() => {
                            cancelingRef.current = true; // Set "cancel activated" to true
                        }}
                        onMouseUp={() => {
                            setTimeout(() => (cancelingRef.current = false), 100); // Reset "cancel activated"
                        }}
                        onPress={() => {
                            setTicketTitle("")
                            onChangeCardVisible("")
                        }}
                        icon={X}
                        scaleIcon={1.4}
                        bc="transparent"
                    />
                </XStack>
                : <Button size="$3" scaleIcon={1.4} icon={Plus} jc="flex-start" bc="transparent" onPress={() => onChangeCardVisible(stage)}>
                    Add new ticket
                </Button>
        }
    </>
}