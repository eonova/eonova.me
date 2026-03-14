function getFontSize(title: string) {
  const baseSize = 80
  const minSize = 50
  const maxChars = 80

  if (title.length <= 30)
    return baseSize

  if (title.length >= maxChars)
    return minSize

  const scale = 1 - (title.length - 20) / (maxChars - 20)
  return Math.round(minSize + (baseSize - minSize) * scale)
}

interface OGImageProps {
  title: string
  url?: string
  /** 站点根 URL，用于 OG 图内 img（next/og 不支持 next/image） */
  baseUrl?: string
}

function OGImage(props: OGImageProps) {
  const { title, url, baseUrl = 'http://localhost:3000' } = props
  const fontSize = getFontSize(title)

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#000',
        padding: 50,
        color: '#fff',
      }}
    >
      <img
        src={`${baseUrl}/favicon/apple-touch-icon.png`}
        width={48}
        height={48}
        alt=""
        style={{ position: 'absolute', left: 50, top: 50 }}
      />
      <div style={{ fontSize, maxWidth: 740, fontWeight: 600 }}>{title}</div>
      <div style={{ display: 'flex', fontSize: 30, position: 'absolute', right: 50, bottom: 50, fontWeight: 500 }}>
        eonova.me
        {url}
      </div>
    </div>
  )
}

export default OGImage
