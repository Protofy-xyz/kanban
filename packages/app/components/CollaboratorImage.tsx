import { useState } from 'react'
import { Chip } from 'protolib/components/Chip'
import { Image } from '@my/ui'

export const CollaboratorImage = ({ username = " ", size = "26px", textProps = {}, containerStyle = {} }) => {
    const [src, setSrc] = useState(`/public/collaborators/${username}.png`);
    const themeNames = ["orange", "yellow", "green", "blue", "purple", "pink", "red"]
    return (
        <div key={username} title={username} style={{ width: size, height: size, ...containerStyle }}>
            {
                src.endsWith(".png") ?
                    <Image onError={() => setSrc(username)} src={src} width={size} height={size} style={{ borderRadius: "100px" }} />
                    : <Chip theme={themeNames[username.length % 7]} height={size} borderRadius={200} width={size} textProps={{ fow: "600", ...textProps }} text={username[0].toUpperCase()} />
            }
        </div>
    )
}