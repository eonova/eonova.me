import UnsubscribeError from '~/components/modules/unsubscribe/unsubscribe-error'
import UnsubscribeForm from '~/components/modules/unsubscribe/unsubscribe-form'
import { getReplyUnsubData } from '~/lib/unsubscribe'
import { loadUnsubscribeParams } from '~/lib/unsubscribe-params'

async function Page(props: PageProps<'/unsubscribe'>) {
  const { searchParams } = props
  const { token } = await loadUnsubscribeParams(searchParams)
  const data = await getReplyUnsubData(token)

  return data ? <UnsubscribeForm data={data} /> : <UnsubscribeError />
}

export default Page
