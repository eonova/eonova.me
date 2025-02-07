import { Monitoring } from 'react-scan/monitoring/next'

interface ReactScanProps {
  apiKey: string
}

function ReactScan(props: ReactScanProps) {
  const { apiKey } = props

  return <Monitoring apiKey={apiKey} url="https://monitoring.react-scan.com/api/v1/ingest" />
}

export default ReactScan
