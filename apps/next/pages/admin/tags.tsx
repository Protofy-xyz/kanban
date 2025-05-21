import Feature from 'app/pages/tags'
import { useSession } from 'protolib/lib/useSession'

export default function TagsPage(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}

export const getServerSideProps = Feature.getServerSideProps