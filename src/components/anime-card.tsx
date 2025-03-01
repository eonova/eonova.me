// src/components/anime-card.tsx
import { Skeleton } from "~/components/base/skeleton"

export function AnimeCard(item: {
  title: string
  detailUrl: string
  coverUrl?: string
  metaInfo: string
  rating?: string
  episodesInfo?: string
}) {
  return (
    <a
      href={item.detailUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative aspect-[3/4]">
        {item.coverUrl ? (
          <img
            src={item.coverUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <div className="p-4 bg-background">
        <h3 className="font-semibold line-clamp-2 mb-2">{item.title}</h3>
        <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {item.metaInfo}
        </div>
        <div className="flex justify-between text-sm">
          {item.rating && (
            <span className="text-primary">★ {item.rating}</span>
          )}
          {item.episodesInfo && <span>{item.episodesInfo}</span>}
        </div>
      </div>
    </a>
  )
}

export function AnimeCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
