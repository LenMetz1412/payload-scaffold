import { useEffect, useState } from 'react'

export const usePlatformDetection = () => {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other')

  useEffect(() => {
    if (typeof navigator === 'undefined') return

    const ua = navigator.userAgent.toLowerCase()
    const isAndroid = /android/i.test(ua)
    const isIos =
      /iphone|ipod|ipad/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)

    if (isIos) setPlatform('ios')
    else if (isAndroid) setPlatform('android')
    else setPlatform('other')
  }, [])

  return platform
}
