import FriendCard from '~/components/friend-card'
import PageTitle from '~/components/page-title'

interface FriendsProps {

}

const title = '友链'
const description = '感谢你愿意和我做朋友🌈'

const mockFriends = [
  {
    name: 'Eonova',
    url: 'https://eonova.me',
    avatar: 'https://example.com/avatar.jpg',
    description: '小明的个人网站',
  },
  {
    name: '困困鱼',
    url: 'https://kunkunyu.com',
    avatar: 'https://example.com/avatar.jpg',
    description: '小红的个人网站',
  },
  {
    name: '小明',
    url: 'https://example.com',
    avatar: 'https://example.com/avatar.jpg',
    description: '小明的个人网站',
  },
  {
    name: '小红',
    url: 'https://example.com',
    avatar: 'https://example.com/avatar.jpg',
    description: '小红的个人网站',
  },
  {
    name: '小明',
    url: 'https://example.com',
    avatar: 'https://example.com/avatar.jpg',
    description: '小明的个人网站',
  },
  {
    name: '小红',
    url: 'https://example.com',
    avatar: 'https://example.com/avatar.jpg',
    description: '小红的个人网站',
  },
]

const Friends: React.FC<FriendsProps> = () => {
  return (
    <>
      <PageTitle
        title={title}
        description={description}
      />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {mockFriends.map((friend, index) => (
            <FriendCard
              key={index}
              name={friend.name}
              url={friend.url}
              avatar={friend.avatar}
              description={friend.description}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Friends
