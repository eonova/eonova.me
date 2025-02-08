import { Img, Section } from '@react-email/components'

function Logo() {
  return (
    <Section className="mb-6">
      <Img
        src="https://leostar.top/images/avatar.png"
        alt="LeoStar's logo"
        width="48"
        height="48"
        className="rounded-full"
      />
    </Section>
  )
}

export default Logo
