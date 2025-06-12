"use client"

import { Share2, Copy, Twitter, Facebook, Linkedin, Check } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

interface ShareProfileProps {
  username: string
  platform: string
}

export function ShareProfile({ username, platform }: ShareProfileProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/${platform}/${username}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=Check out ${username}'s ${platform} profile!&url=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    )
  }

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    )
  }

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    )
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleCopy}
      >
        {copied ? "Copied!" : "Copy Link"}
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={shareToTwitter}
      >
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Share on Twitter</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={shareToFacebook}
      >
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Share on Facebook</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={shareToLinkedIn}
      >
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">Share on LinkedIn</span>
      </Button>
    </div>
  )
} 