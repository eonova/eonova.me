import NeoDBContent from '~/components/pages/neodb/content'
import PageTitle from '~/components/shared/page-title'

function Page() {
  return (
    <div className="container mx-auto">
      <PageTitle title="书影番" description="我的收集与标记📚🎬🎮" />
      <NeoDBContent />
    </div>
  )
}

export default Page
