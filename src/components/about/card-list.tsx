'use client'
import type { CardData } from '../shared/card'
import * as React from 'react'
import { Card } from '../shared/card'
import { CardProvider, useCardContext } from '../shared/card/CardContext'
import '~/styles/card.css'

const cardData: CardData[] = [
  // Photo by ivan Torres on Unsplash
  {
    id: 'c',
    category: 'Pizza',
    title: '5 Food Apps Delivering the Best of Your City',
    pointOfInterest: 80,
    backgroundColor: '#814A0E',
  },
  // Photo by Dennis Brendel on Unsplash
  {
    id: 'f',
    category: 'How to',
    title: 'Arrange Your Apple Devices for the Gram',
    pointOfInterest: 120,
    backgroundColor: '#959684',
  },
  // Photo by Alessandra Caretto on Unsplash
  {
    id: 'a',
    category: 'Pedal Power',
    title: 'Map Apps for the Superior Mode of Transport',
    pointOfInterest: 260,
    backgroundColor: '#5DBCD2',
  },
  // Photo by Taneli Lahtinen on Unsplash
  {
    id: 'g',
    category: 'Holidays',
    title: 'Our Pick of Apps to Help You Escape From Apps',
    pointOfInterest: 200,
    backgroundColor: '#8F986D',
  },
  // Photo by Simone Hutsch on Unsplash
  {
    id: 'd',
    category: 'Photography',
    title: 'The Latest Ultra-Specific Photography Editing Apps',
    pointOfInterest: 150,
    backgroundColor: '#FA6779',
  },
  // Photo by Siora Photography on Unsplash
  {
    id: 'h',
    category: 'They\'re all the same',
    title: '100 Cupcake Apps for the Cupcake Connoisseur',
    pointOfInterest: 60,
    backgroundColor: '#282F49',
  },
]

function List() {
  const { selectedCardId, setSelectedCardId } = useCardContext()

  return (
    <ul className="card-list">
      {cardData.map(card => (
        <Card
          key={card.id}
          isSelected={selectedCardId === card.id}
          onSelect={() => setSelectedCardId(selectedCardId === card.id ? null : card.id)}
          {...card}
        />
      ))}
    </ul>
  )
}

export default function CardList() {
  return (
    <CardProvider>
      <List />
    </CardProvider>
  )
}
