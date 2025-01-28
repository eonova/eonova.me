import CardList from '~/components/about/card-list'
import PageTitle from '~/components/page-title'

const About: React.FC = () => {
  return (
    <>
      <PageTitle
        title="关于"
        description="👋 嗨！我是 LeoStar，一个热爱网页开发的学生。"
      />
      <CardList />
    </>
  )
}

export default About
