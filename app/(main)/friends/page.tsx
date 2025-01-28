import PageTitle from '~/components/page-title'

interface FriendsProps {

}

const Friends: React.FC<FriendsProps> = () => {
  return (
    <>
      <PageTitle
        title="友链"
        description="有朋自远方来，不亦乐乎。"
      />
    </>
  )
}

export default Friends
