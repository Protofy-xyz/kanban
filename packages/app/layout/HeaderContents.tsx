import { HeaderContents as ProtoHeaderContents, HeaderContentsProps } from 'protolib/components/layout/HeaderContents'
import { HeaderLink } from 'protolib/components/HeaderLink'
import { isElectron } from 'protolib/lib/isElectron'
import { Tinted } from 'protolib/components/Tinted'
import { Text } from '@my/ui'
import { Paragraph, XStack } from '@my/ui';
import dynamic from 'next/dynamic';
import { SiteConfig } from '../conf';
import { useEffect, useState } from 'react';

export const HeaderContents = (props: HeaderContentsProps & { headerTitle?: string }) => {
  //@ts-ignore
  const SessionInfo = dynamic(() => import('./SessionInfo'), { ssr: false })

  const projectName = SiteConfig.projectName ?? 'Protofy'

  const [showMenu, setShowMenu] = useState(false)
  useEffect(() => {
    if (!isElectron()) {
      setShowMenu(true)
    }
  }, []);

  return <ProtoHeaderContents
    logo={<Paragraph mr={"$2"}><Text fontSize={20} fontWeight={"400"}>{props.headerTitle ?? projectName}</Text></Paragraph>}
    rightArea={<XStack ai="center">
      {props.topBar}
      {showMenu && <XStack $xs={{ display: 'none' }}>
        <Tinted>
          {SiteConfig.documentationVisible ? <HeaderLink id="header-session-doc" href={SiteConfig.useLocalDocumentation ? "/documentation" : "https://protofy.xyz/documentation"}>Docs</HeaderLink> : <></>}
          {
            <SessionInfo />
          }
        </Tinted>
      </XStack>}
      {/* <XStack>
          <ConnectionIndicator />
        </XStack> */}
    </XStack>}
    {...props}
  />
}


