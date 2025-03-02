import PageTitle from '~/components/page-title'

interface ArchiveProps {

}

const title = '归档'
const description = '回望过往，方知自己的成长。'

const Archive: React.FC<ArchiveProps> = () => {
  return (
    <>
      <PageTitle title={title} description={description} />
      <div className="bg-gray-300/10 rounded-2xl flex justify-center items-center w-full mx-auto h-[50vh] p-5 mt-10">
        <p>🚧 归档页面（建设中）</p>
      </div>
    </>
  )
}

export default Archive
