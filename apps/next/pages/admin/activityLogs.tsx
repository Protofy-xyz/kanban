import Feature from 'app/pages/activityLogs'
import { useSession } from 'protolib/lib/useSession'

export default function ActivityLogsPage(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}

export const getServerSideProps = Feature.getServerSideProps