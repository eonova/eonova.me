'use client'

import { useEffect } from 'react'

/**
 * 性能监控组件
 * 监控 Core Web Vitals 和其他性能指标
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // 只在生产环境和支持 PerformanceObserver 的浏览器中运行
    if (
      process.env.NODE_ENV !== 'production'
      || typeof window === 'undefined'
      || !('PerformanceObserver' in window)
    ) {
      return
    }

    // 监控 Largest Contentful Paint (LCP)
    const observeLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number }

        // 发送到分析服务
        if (typeof gtag !== 'undefined') {
          gtag('event', 'LCP', {
            event_category: 'Web Vitals',
            value: Math.round(lastEntry.startTime),
            non_interaction: true,
          })
        }

        console.log('LCP:', lastEntry.startTime)
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      return observer
    }

    // 监控 First Input Delay (FID)
    const observeFID = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEntry & {
            processingStart: number
            startTime: number
          }
          const fid = fidEntry.processingStart - fidEntry.startTime

          if (typeof gtag !== 'undefined') {
            gtag('event', 'FID', {
              event_category: 'Web Vitals',
              value: Math.round(fid),
              non_interaction: true,
            })
          }

          console.log('FID:', fid)
        }
      })

      observer.observe({ entryTypes: ['first-input'] })
      return observer
    }

    // 监控 First Contentful Paint (FCP)
    const observeFCP = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'FCP', {
                event_category: 'Web Vitals',
                value: Math.round(entry.startTime),
                non_interaction: true,
              })
            }

            console.log('FCP:', entry.startTime)
          }
        }
      })

      observer.observe({ entryTypes: ['paint'] })
      return observer
    }

    // 监控 Time to First Byte (TTFB)
    const observeTTFB = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as PerformanceNavigationTiming
          const ttfb = navEntry.responseStart - navEntry.requestStart

          if (typeof gtag !== 'undefined') {
            gtag('event', 'TTFB', {
              event_category: 'Web Vitals',
              value: Math.round(ttfb),
              non_interaction: true,
            })
          }

          console.log('TTFB:', ttfb)
        }
      })

      observer.observe({ entryTypes: ['navigation'] })
      return observer
    }

    // 启动所有观察器
    const observers = [observeLCP(), observeFID(), observeFCP(), observeTTFB()]

    // 清理函数
    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  // 监控资源加载性能
  useEffect(() => {
    if (typeof window === 'undefined')
      return

    const handleLoad = () => {
      // 获取导航时间
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming

      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          ssl: navigation.connectEnd - navigation.secureConnectionStart,
          ttfb: navigation.responseStart - navigation.requestStart,
          download: navigation.responseEnd - navigation.responseStart,
          domParse: navigation.domContentLoadedEventStart - navigation.responseEnd,
          domReady: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        }

        console.log('Navigation Metrics:', metrics)

        // 发送到分析服务
        if (typeof gtag !== 'undefined') {
          Object.entries(metrics).forEach(([key, value]) => {
            gtag('event', `navigation_${key}`, {
              event_category: 'Performance',
              value: Math.round(value),
              non_interaction: true,
            })
          })
        }
      }

      // 获取资源加载时间
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const slowResources = resources.filter(resource => resource.duration > 1000)

      if (slowResources.length > 0) {
        console.warn('Slow resources detected:', slowResources)

        if (typeof gtag !== 'undefined') {
          gtag('event', 'slow_resources', {
            event_category: 'Performance',
            value: slowResources.length,
            non_interaction: true,
          })
        }
      }
    }

    // 页面加载完成后执行
    if (document.readyState === 'complete') {
      handleLoad()
      // No cleanup needed for immediate execution
      return void 0
    }
    window.addEventListener('load', handleLoad)
    return () => window.removeEventListener('load', handleLoad)
  }, [])

  return null // 这是一个无UI的监控组件
}

/**
 * 错误边界监控
 */
export function ErrorBoundaryMonitor({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 监控未捕获的错误
    const handleError = (event: ErrorEvent) => {
      console.error('Uncaught error:', event.error)

      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: event.error?.message || 'Unknown error',
          fatal: false,
        })
      }
    }

    // 监控未处理的 Promise 拒绝
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)

      if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
          description: event.reason?.message || 'Unhandled promise rejection',
          fatal: false,
        })
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return <>{children}</>
}

/**
 * 高级性能监控组件
 */
export function AdvancedPerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return
    }

    // 监控内存使用
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const memoryInfo = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        }

        // 内存使用率超过 80% 时警告
        const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit
        if (usageRatio > 0.8) {
          console.warn('High memory usage detected:', memoryInfo)

          if (typeof gtag !== 'undefined') {
            gtag('event', 'high_memory_usage', {
              event_category: 'Performance',
              value: Math.round(usageRatio * 100),
              non_interaction: true,
            })
          }
        }
      }
    }

    // 监控长任务
    const observeLongTasks = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
            })

            if (typeof gtag !== 'undefined') {
              gtag('event', 'long_task', {
                event_category: 'Performance',
                value: Math.round(entry.duration),
                non_interaction: true,
              })
            }
          })
        })

        try {
          observer.observe({ entryTypes: ['longtask'] })
          return observer
        }
        catch (error) {
          console.warn('Long task observer not supported', error)
          return undefined
        }
      }
      return undefined
    }

    // 监控网络状态
    const monitorNetworkStatus = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection

        const logNetworkInfo = () => {
          const networkInfo = {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData,
          }

          console.log('Network status:', networkInfo)

          // 慢网络警告
          if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'slow_network', {
                event_category: 'Performance',
                value: connection.downlink,
                non_interaction: true,
              })
            }
          }
        }

        logNetworkInfo()
        connection.addEventListener('change', logNetworkInfo)

        return () => connection.removeEventListener('change', logNetworkInfo)
      }
      return undefined // Return undefined if connection API is not available
    }

    // 启动监控
    const memoryInterval = setInterval(monitorMemory, 30000) // 每30秒检查内存
    const longTaskObserver = observeLongTasks()
    const networkCleanup = monitorNetworkStatus()

    // 清理函数
    return () => {
      clearInterval(memoryInterval)
      longTaskObserver?.disconnect()
      networkCleanup?.()
    }
  }, [])

  return null
}

// 类型声明
declare global {
  function gtag(...args: any[]): void
}
