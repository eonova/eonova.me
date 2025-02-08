import { Column, Hr, Img, Link, Row, Section, Text } from '@react-email/components'

function Footer() {
  return (
    <>
      <Hr className="border-t-border mb-3 mt-6" />
      <Section>
        <Row className="mt-4" align="left" width="auto">
          <Column className="pr-6 align-middle">
            <Link href="https://twitter.com/leostar" className="text-xl text-black">
              <Img src="https://leostar.top/images/email/x.png" alt="X" width={22} height={22} />
            </Link>
          </Column>
          <Column className="align-middle">
            <Link href="https://github.com/ileostar/leospark" className="text-xl text-black">
              <Img
                src="https://leostar.top/images/email/github.png"
                alt="GitHub"
                width={22}
                height={22}
              />
            </Link>
          </Column>
        </Row>
      </Section>
      <Text className="m-0 mt-6 p-0 text-xs font-normal text-gray-500">
        ©
        {' '}
        {new Date().getFullYear()}
        {' '}
        LeoStar. All rights reserved.
      </Text>
    </>
  )
}

export default Footer
