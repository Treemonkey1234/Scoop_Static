'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { getCurrentUser, User, connectSocialAccount, socialPlatforms } from '@/lib/sampleData'
import { 
  ArrowLeftIcon,
  PlusIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

// Social media platform SVG components
const SocialIcon = ({ platform }: { platform: string }) => {
  const getIcon = () => {
    switch (platform) {
      case 'Facebook':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )
      case 'Twitter':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1DA1F2">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        )
      case 'Instagram':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
            <defs>
              <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#833AB4"/>
                <stop offset="50%" stopColor="#FD1D1D"/>
                <stop offset="100%" stopColor="#FCB045"/>
              </linearGradient>
            </defs>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        )
      case 'LinkedIn':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        )
      case 'GitHub':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#333">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      case 'YouTube':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        )
      case 'TikTok':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        )
      case 'Snapchat':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFC00">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-.219c-.219-.406-.359-1.09-.359-1.90 0-1.781 1.032-3.108 2.322-3.108 1.095 0 1.624.824 1.624 1.781 0 1.085-.219 2.703-.219 4.211 0 1.781 1.406 3.218 3.108 3.218 3.73 0 6.608-3.938 6.608-9.621 0-5.029-3.611-8.556-8.717-8.556-5.939 0-9.429 4.467-9.429 9.081 0 1.781.687 3.68 1.547 4.717.17.199.195.375.145.578-.109.453-.359 1.781-.406 2.034-.063.328-.203.406-.469.25-1.75-.812-2.844-3.358-2.844-5.407 0-4.408 3.203-8.461 9.234-8.461 4.848 0 8.616 3.45 8.616 8.055 0 4.806-3.03 8.677-7.234 8.677-1.412 0-2.742-.734-3.195-1.609l-.859 3.265c-.312 1.203-1.156 2.719-1.719 3.641C9.84 23.673 10.898 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
          </svg>
        )
      case 'Discord':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#5865F2">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Z"/>
          </svg>
        )
      case 'Reddit':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF4500">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
        )
      case 'WhatsApp':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
          </svg>
        )
      case 'Telegram':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#0088CC">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.305.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        )
      case 'Pinterest':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#BD081C">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-.219c-.219-.406-.359-1.09-.359-1.90 0-1.781 1.032-3.108 2.322-3.108 1.095 0 1.624.824 1.624 1.781 0 1.085-.219 2.703-.219 4.211 0 1.781 1.406 3.218 3.108 3.218 3.73 0 6.608-3.938 6.608-9.621 0-5.029-3.611-8.556-8.717-8.556-5.939 0-9.429 4.467-9.429 9.081 0 1.781.687 3.68 1.547 4.717.17.199.195.375.145.578-.109.453-.359 1.781-.406 2.034-.063.328-.203.406-.469.25-1.75-.812-2.844-3.358-2.844-5.407 0-4.408 3.203-8.461 9.234-8.461 4.848 0 8.616 3.45 8.616 8.055 0 4.806-3.03 8.677-7.234 8.677-1.412 0-2.742-.734-3.195-1.609l-.859 3.265c-.312 1.203-1.156 2.719-1.719 3.641C9.84 23.673 10.898 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
          </svg>
        )
      case 'Twitch':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#9146FF">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.414V1.714h13.714Z"/>
          </svg>
        )
      case 'Steam':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
            <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.030 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.62 20.565 6.363 24.436 11.979 24c6.624.057 11.89-5.179 11.893-11.803C23.98 5.51 18.755.001 11.979 0zm-4.654 17.24l-1.665-.68c.317.652.923 1.134 1.667 1.134.995 0 1.807-.8 1.807-1.794 0-.992-.814-1.794-1.807-1.794-.28 0-.544.063-.782.177l1.713.7c.736.3 1.083 1.139.783 1.875-.297.732-1.140 1.082-1.875.783-.051-.021-.095-.049-.141-.080zm10.6-9.332c0-1.663-1.351-3.015-3.015-3.015-1.665 0-3.015 1.352-3.015 3.015 0 1.664 1.35 3.015 3.015 3.015 1.664 0 3.015-1.351 3.015-3.015zm-5.418 0c0-1.329 1.077-2.405 2.403-2.405 1.33 0 2.405 1.076 2.405 2.405 0 1.328-1.075 2.405-2.405 2.405-1.326 0-2.403-1.077-2.403-2.405z"/>
          </svg>
        )
      case 'Signal':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#3A76F0">
            <path d="M12.006 0C5.374 0 0 5.373 0 12.006S5.374 24.012 12.006 24.012c6.628 0 12.006-5.373 12.006-12.006S18.634.001 12.006.001zm5.618 8.177l-2.786 13.15c-.208.98-.757 1.223-1.535.761l-4.244-3.126-2.047 1.97c-.227.226-.416.415-.853.415l.305-4.317 7.865-7.112c.342-.305-.074-.475-.531-.17L17.618 6.22c.758-.283 1.42.17 1.174 1.197l-.168.76z"/>
          </svg>
        )
      case 'Clubhouse':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#F1C40F">
            <path d="M23.75 12.19c-.11-2.78-1.95-5.25-4.52-6.07l.02.42c.05 1.13-.4 2.25-1.2 3.08-.81.84-1.95 1.32-3.12 1.32h-.01c-.58 0-1.14-.12-1.66-.35-.51-.23-.97-.56-1.35-.96-.38.4-.84.73-1.35.96-.52.23-1.08.35-1.66.35h-.01c-1.17 0-2.31-.48-3.12-1.32-.8-.83-1.25-1.95-1.2-3.08l.02-.42C1.45 6.94.61 9.41.5 12.19c-.12 3.04.88 6.02 2.77 8.23 1.89 2.21 4.53 3.58 7.32 3.58s5.43-1.37 7.32-3.58c1.89-2.21 2.89-5.19 2.77-8.23z"/>
            <circle cx="7.5" cy="8.5" r="1.5" fill="#fff"/>
            <circle cx="16.5" cy="8.5" r="1.5" fill="#fff"/>
          </svg>
        )
      case 'BeReal':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#000">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-12S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <circle cx="9" cy="9" r="1.5"/>
            <circle cx="15" cy="9" r="1.5"/>
            <path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
        )
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#6B7280">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
    }
  }
  
  return <div className="w-6 h-6">{getIcon()}</div>
}

export default function ConnectedAccounts() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [usernameInput, setUsernameInput] = useState('')
  const [startX, setStartX] = useState(0)
  const platformsPerPage = 6

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  const handleConnect = (platform: string) => {
    if (currentUser) {
      connectSocialAccount(platform, currentUser.id)
      // Refresh user data
      const updatedUser = getCurrentUser()
      setCurrentUser(updatedUser)
    }
  }

  const platforms = Object.entries(socialPlatforms)
  const totalPages = Math.ceil(platforms.length / platformsPerPage)
  const currentPlatforms = platforms.slice(
    currentPage * platformsPerPage,
    (currentPage + 1) * platformsPerPage
  )

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const diff = startX - endX

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0 && currentPage < totalPages - 1) {
        // Swipe left - next page
        setCurrentPage(prev => prev + 1)
      } else if (diff < 0 && currentPage > 0) {
        // Swipe right - previous page
        setCurrentPage(prev => prev - 1)
      }
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 md:space-y-10">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link href="/profile" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">Connected Accounts</h1>
              <p className="text-sm text-slate-600 mt-1 hidden sm:block">Manage your social media connections</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap">
            {Object.values(currentUser?.socialLinks || {}).filter(Boolean).length || 0} connected
          </div>
        </div>

        {/* Connected Social Accounts */}
        {Object.values(currentUser?.socialLinks || {}).some(Boolean) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 md:p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-slate-800">Your Connected Accounts</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(currentUser?.socialLinks || {}).map(([platform, handle], index) => (
                handle && (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-green-100 flex-shrink-0">
                          <span className="text-xl">
                            {platform === 'instagram' ? '📸' : platform === 'twitter' ? '🐦' : platform === 'linkedin' ? '💼' : '🔗'}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-slate-800 capitalize">{platform}</h3>
                          <p className="text-sm text-slate-600 truncate">{handle}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-700 font-medium">Connected</span>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Available Platforms - Swipeable */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-800">Available Platforms</h2>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xs text-slate-500">Page {currentPage + 1} of {totalPages}</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => prev > 0 ? prev - 1 : prev)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev < totalPages - 1 ? prev + 1 : prev)}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Swipe instruction for mobile */}
          <div className="text-center text-sm text-slate-500 mb-6 md:hidden bg-slate-50 py-3 rounded-lg">
            ← Swipe to navigate between platforms →
          </div>

          {/* Swipeable platform grid */}
          <div
            className="grid grid-cols-2 gap-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {currentPlatforms.map(([platform, icon]) => {
              const isConnected = platform.toLowerCase() in (currentUser?.socialLinks || {}) && 
                                currentUser?.socialLinks[platform.toLowerCase() as keyof typeof currentUser.socialLinks]

              return (
                <div
                  key={platform}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-lg transform hover:-translate-y-1 ${
                    isConnected
                      ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
                      : 'border-slate-200 bg-white hover:border-cyan-200 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-teal-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100">
                      <SocialIcon platform={platform} />
                    </div>
                    <div className="text-center min-w-0 w-full">
                      <h3 className="font-medium text-slate-800 text-sm truncate">{platform}</h3>
                      {isConnected ? (
                        <span className="text-xs text-green-600 flex items-center justify-center mt-1">
                          <CheckBadgeIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                          Connected
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedPlatform(platform)}
                          className="text-xs text-cyan-600 hover:text-cyan-700 mt-1 hover:underline transition-colors"
                        >
                          Connect →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Connect Platform Form */}
        {selectedPlatform && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 md:p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-slate-800">
                Connect {selectedPlatform}
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {selectedPlatform} Username
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={`Enter your ${selectedPlatform} username`}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleConnect(selectedPlatform)
                    setSelectedPlatform(null)
                    setUsernameInput('')
                  }}
                  disabled={!usernameInput.trim()}
                  className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Connect Account
                </button>
                <button
                  onClick={() => {
                    setSelectedPlatform(null)
                    setUsernameInput('')
                  }}
                  className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


      </div>
    </Layout>
  )
} 