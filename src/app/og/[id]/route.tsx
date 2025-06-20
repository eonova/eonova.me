import fs from 'node:fs'
import path from 'node:path'

import { allPosts } from 'content-collections'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import { SITE_URL } from '~/config/constants'
import { db, eq, posts } from '~/db'
import { getErrorMessage } from '~/utils'

interface OGRouteProps {
  params: Promise<{
    id: string
  }>
}

export async function GET(_: Request, props: OGRouteProps) {
  try {
    const { id } = await props.params
    const postMetadata = allPosts.find(p => p.slug === id)

    if (!postMetadata) {
      return NextResponse.json(
        {
          error: 'Post not found',
        },
        {
          status: 404,
        },
      )
    }

    const { title, date } = postMetadata

    const getTitleFontSize = () => {
      if (title.length > 50)
        return 36
      if (title.length > 40)
        return 48
      return 64
    }

    const roboto = fs.readFileSync(
      path.join(process.cwd(), 'src/app/og/[id]/RobotoCondensed-Bold.ttf'),
    )

    const post = await db
      .select({
        views: posts.views,
        likes: posts.likes,
      })
      .from(posts)
      .where(eq(posts.slug, id))

    const textColor = 'hsl(0 0% 90%)'

    const img = new ImageResponse(
      (
        <div
          style={{
            backgroundImage: `url(${SITE_URL}/images/og-background.png)`,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 56px',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Roboto Condensed',
            fontWeight: 700,
          }}
        >
          <div
            style={{
              color: textColor,
              fontSize: 30,
            }}
          >
            {date.split('T')[0]}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: getTitleFontSize(),
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                letterSpacing: '-0.03em',
                color: 'transparent',
                backgroundImage: 'linear-gradient(91.52deg, #FF4D4D 0.79%, #FFCCCC 109.05%)',
                marginBottom: 24,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
                gap: 16,
                color: textColor,
              }}
            >
              <span>
                {post[0]?.likes ?? 0}
                {' '}
                likes
              </span>
              <span>·</span>
              <span>
                {post[0]?.views ?? 0}
                {' '}
                views
              </span>
            </div>
          </div>
          <div
            style={{
              color: textColor,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="none"
              version="1.1"
              width="128.1899566650390"
              height="128.18995666503906"
              viewBox="50 0 128.1899566650390 128.18995666503906"
            >
              <g>
                <g transform="matrix(0.5963889956474304,0.8026955723762512,-0.922498881816864,0.38586872816085815,68.04686551627765,-135.3305957344137)">
                  <path
                    d="M168.8689930673828,0.10176C168.8183710673828,-0.0748444,168.55522896738282,-0.00296816,168.60034760738282,0.17514C168.60522536738281,0.194396,168.6141218673828,0.212386,168.6264445673828,0.227915L169.0627620673828,0.77776L168.8689930673828,0.10176ZM169.0627620673828,0.77776L189.94046906738282,73.6134C190.1036690673828,74.183,190.62096906738282,74.5758,191.21016906738282,74.5778L278.4911690673828,74.8671C278.70016906738283,74.8678,278.9031690673828,74.8912,279.1071690673828,74.9392Q290.9301690673828,77.728,290.9301690673828,77.7256Q290.9311690673828,77.7237,283.0061690673828,75.8508Q265.40936906738284,71.6919,212.05426906738282,54.2251C211.54146906738282,54.0573,211.09196906738282,53.7428,210.75556906738282,53.3188L169.0627620673828,0.77776Z"
                    fill="#FFC300"
                    fillOpacity="1"
                  />
                </g>
                <g transform="matrix(-0.6016507148742676,-0.7987593412399292,0.9210169911384583,-0.3895221948623657,-6.109469394993539,217.89957482844784)">
                  <path
                    d="M65.0428470415039,119.55527388222656C65.0161610415039,119.46676938222656,64.88422454150391,119.50566392022657,64.90924436150391,119.59466008222657C64.9112566715039,119.60181718222657,64.9143892515039,119.60860528222656,64.91852484150391,119.61477128222656L65.17695704150391,120.00004728222656L65.0428470415039,119.55527388222656ZM65.17695704150391,120.00004728222656L89.2406050415039,199.80686428222657C89.3504050415039,200.17106428222655,89.6847050415039,200.41966428222656,90.06290504150391,200.41866428222656L170.0781050415039,200.19646428222654C172.58810504150392,200.18956428222657,173.74910504150392,197.11126428222656,171.8251050415039,195.48916428222657Q154.97780504150393,181.28546428222657,139.8795050415039,177.52006428222657Q123.5702050415039,173.45266428222658,108.18290504150391,179.93586428222656C106.9296050415039,180.46396428222656,105.4658050415039,180.06346428222656,104.70580504150391,178.93036428222655L65.17695704150391,120.00004728222656Z"
                    fill="#FF4040"
                    fillOpacity="1"
                  />
                </g>
              </g>
            </svg>
            <div
              style={{
                fontSize: 30,
              }}
            >
              eonova.me
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Roboto Condensed',
            data: roboto,
            weight: 700,
            style: 'normal',
          },
        ],
        debug: true,
        statusText: 'Generated by eonova.me',
      },
    )

    return img
  }
  catch (error) {
    return NextResponse.json(
      {
        error: `Failed to generate image: ${getErrorMessage(error)}`,
      },
      {
        status: 500,
      },
    )
  }
}
