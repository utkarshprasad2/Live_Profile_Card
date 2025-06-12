"use client"

import { motion } from "framer-motion"

export const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    scale: 0.95
  },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export const hoverScale = {
  whileHover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
}

export const MotionWrapper = motion.div
export const MotionImage = motion.img 