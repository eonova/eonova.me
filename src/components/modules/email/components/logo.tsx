import { Img, Section } from '@react-email/components'

function Logo() {
  return (
    <Section className="mb-6">
      <Img
        src="https://eonova.me/images/avatar.png"
        alt="Eonova's logo"
        width="48"
        height="48"
        className="rounded-full"
      />
    </Section>
  )
}

export default Logo
