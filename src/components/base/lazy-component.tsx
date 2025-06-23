'use client'

import type { ComponentType, ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { useIntersectionObserver } from '~/hooks/use-intersection-observer'

interface LazyComponentProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  className?: string
}

/**
 * 基于 Intersection Observer 的懒加载组件
 */
export function LazyComponent({
  children,
  fallback = <div className="h-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  className,
}: LazyComponentProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce,
  })

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>} className={className}>
      {isIntersecting ? children : fallback}
    </div>
  )
}

/**
 * 动态导入组件的高阶函数
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode,
) {
  const LazyComp = lazy(importFunc)

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <ComponentSkeleton />}>
        <LazyComp {...props} />
      </Suspense>
    )
  }
}

/**
 * 通用组件骨架屏
 */
export function ComponentSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="space-y-2">
        <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  )
}

/**
 * 卡片骨架屏
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="mb-4 h-48 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  )
}

/**
 * 列表骨架屏
 */
export function ListSkeleton({ count = 3, className }: { count?: number, className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex animate-pulse space-x-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * 表格骨架屏
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-3">
        {/* 表头 */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
          ))}
        </div>

        {/* 表格行 */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 文章骨架屏
 */
export function ArticleSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      {/* 标题 */}
      <div className="space-y-2">
        <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* 特色图片 */}
      <div className="h-64 rounded-lg bg-gray-200 dark:bg-gray-700"></div>

      {/* 内容段落 */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 预加载组件
 */
export function PreloadComponent({
  importFunc,
  trigger = 'hover',
}: {
  importFunc: () => Promise<any>
  trigger?: 'hover' | 'visible' | 'immediate'
}) {
  const handlePreload = () => {
    importFunc().catch(console.error)
  }

  if (trigger === 'immediate') {
    handlePreload()
  }

  return <div onMouseEnter={trigger === 'hover' ? handlePreload : undefined} className="contents" />
}

// 常用的懒加载组件预设
export const LazyPresets = {
  // 重型图表组件 - 暂时注释掉，等组件创建后再启用
  // Chart: createLazyComponent(
  //   () => import('~/components/charts/chart-component'),
  //   <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
  //     <span className="text-gray-500">加载图表中...</span>
  //   </div>,
  // ),
  // 代码编辑器 - 暂时注释掉，等组件创建后再启用
  // CodeEditor: createLazyComponent(
  //   () => import('~/components/editor/code-editor'),
  //   <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
  //     <span className="text-gray-500">加载编辑器中...</span>
  //   </div>,
  // ),
  // 3D 组件 - 暂时注释掉，等组件创建后再启用
  // ThreeScene: createLazyComponent(
  //   () => import('~/components/three/scene'),
  //   <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
  //     <span className="text-gray-500">加载 3D 场景中...</span>
  //   </div>,
  // ),
}
