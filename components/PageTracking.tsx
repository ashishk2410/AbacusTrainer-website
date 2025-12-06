'use client'

import { useButtonTracking } from '@/hooks/useButtonTracking'
import { usePageTracking } from '@/hooks/usePageTracking'

export default function PageTracking() {
  // Hooks check cookie consent internally
  useButtonTracking()
  usePageTracking()
  
  return null
}

