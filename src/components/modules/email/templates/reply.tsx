import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

import Footer from '../components/footer'
import GeistFont from '../components/geist-font'
import Logo from '../components/logo'

interface ReplyEmailTemplateProps {
  reply: string
  replierName: string
  replierImage: string
  comment: string
  date: string
  replierIdentifier: string
  contentTitle: string
  contentUrl: string
  unsubscribeUrl: string
}

function ReplyEmailTemplate(props: ReplyEmailTemplateProps) {
  const { reply, replierName, replierImage, comment, date, replierIdentifier, contentTitle, contentUrl, unsubscribeUrl }
    = props

  return (
    <Html>
      <Head>
        <GeistFont />
      </Head>
      <Preview>
        New reply on the post "
        {contentTitle}
        " on eonova.me
      </Preview>
      <Tailwind>
        <Body className="m-auto bg-white p-1">
          <Container className="mx-auto w-full max-w-[660px] rounded-lg border border-solid border-[#e5e5e5] bg-white p-8 shadow-sm">
            <Logo />
            <Section>
              <Text className="m-0 p-0 text-xl font-semibold text-gray-900">Reply to Your Comment</Text>
              <Text className="mx-0 mt-2 mb-0 p-0 text-base font-normal text-gray-500">
                {replierName}
                {' '}
                replied to your comment on
                {' '}
                <Link href={contentUrl} className="font-medium text-gray-900">
                  {contentTitle}
                </Link>
              </Text>
            </Section>
            <Section className="mt-6 rounded-lg border border-solid border-[#e5e5e5] bg-gray-50 p-6">
              <Row>
                <Column className="w-10">
                  <Img
                    src={replierImage}
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt={`${replierName}'s avatar`}
                  />
                </Column>
                <Column>
                  <Text className="m-0 py-0 pr-0 pl-3 text-base font-medium text-gray-900">{replierName}</Text>
                  <Text className="m-0 py-0 pr-0 pl-3 text-sm font-normal text-gray-500">{date}</Text>
                </Column>
              </Row>
              <Section className="mt-4 rounded-r-lg border-l-4 border-solid border-[#e5e5e5] bg-gray-100 px-3 py-4">
                <Text className="m-0 p-0 text-sm font-normal text-gray-500">{comment}</Text>
              </Section>
              <Text className="mx-0 mt-4 mb-0 p-0 text-base font-normal text-gray-700">{reply}</Text>
            </Section>
            <Button
              className="mt-6 rounded-full bg-gray-900 px-8 py-2.5 align-middle text-sm font-medium text-white"
              href={`${contentUrl}?${replierIdentifier}`}
            >
              View Reply
            </Button>
            <Text className="text-xs text-gray-500">
              You received this because you enabled notifications for replies to your comments. If you wish to stop
              receiving these emails, please update your
              {' '}
              <Link href="https://eonova.me/account/settings">account settings</Link>
              . To stop receiving reply
              notifications for this specific comment, you can
              <Link href={unsubscribeUrl}>unsubscribe</Link>
              .
            </Text>
            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ReplyEmailTemplate.PreviewProps = {
  reply:
    'Thank you for your kind words! I\'m glad you found the article helpful. Let me know if you have any questions!',
  replierName: 'John Smith',
  replierImage: 'https://eonova.me/api/avatar/john-doe',
  comment: 'This is exactly what I needed! The explanations are clear and concise. Thanks for sharing! 👏',
  date: 'January 2, 2025',
  replierIdentifier: 'comment=1&reply=1',
  contentTitle: 'Understanding Modern Web Development',
  contentUrl: 'http://localhost:3000/blog/understanding-modern-web-development',
  unsubscribeUrl: 'http://localhost:3000/unsubscribe?token=abc123',
} satisfies ReplyEmailTemplateProps

export default ReplyEmailTemplate
