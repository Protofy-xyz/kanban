import Feature from 'app/pages/tickets'
import { useSession } from 'protolib/lib/useSession'

export default function TicketsPage(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}

export const getServerSideProps = Feature.getServerSideProps