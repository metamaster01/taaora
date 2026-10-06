'use client'

import { AnimatePresence, motion } from 'framer-motion'
import LottiePlayer from '@/components/LottiePlayer'

export default function ProcessingOverlay({
  show,
  label = 'Confirming your order…',
}: {
  show: boolean
  label?: string
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper/95 px-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <LottiePlayer src="/process-complete.json" loop className="h-36 w-36 sm:h-44 sm:w-44" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="mt-2 font-display text-lg italic text-ink"
          >
            {label}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-1 text-sm text-muted"
          >
            Just a moment, we're wrapping things up.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}