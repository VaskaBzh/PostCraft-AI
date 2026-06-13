'use client'

import { Heart, Repeat2, MessageCircle, ThumbsUp, Send } from 'lucide-react'
import { CHAR_LIMITS } from '@/entities/platform/constants'
import type { Platform } from '@/entities/platform/types'

interface Props {
  text: string
  platform: Platform
}

const AVATAR = (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex-shrink-0" />
)

function TwitterPreview({ text }: { text: string }) {
  const over = text.length > 280
  return (
    <div className="bg-white rounded-2xl p-4 text-black max-w-sm mx-auto shadow-lg">
      <div className="flex gap-3">
        {AVATAR}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="font-bold text-sm">PostCraft User</span>
            <span className="text-slate-500 text-xs">@user</span>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
          {over && <p className="text-red-500 text-xs mt-1">{text.length}/280</p>}
          <div className="flex gap-5 mt-3 text-slate-500">
            <button className="flex items-center gap-1 text-xs hover:text-blue-500"><MessageCircle className="w-3.5 h-3.5" /> 0</button>
            <button className="flex items-center gap-1 text-xs hover:text-green-500"><Repeat2 className="w-3.5 h-3.5" /> 0</button>
            <button className="flex items-center gap-1 text-xs hover:text-red-500"><Heart className="w-3.5 h-3.5" /> 0</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InstagramPreview({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden max-w-sm mx-auto shadow-lg text-black">
      <div className="aspect-square bg-gradient-to-br from-violet-400 to-blue-400 flex items-center justify-center text-white text-4xl">📸</div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          {AVATAR}
          <span className="font-semibold text-sm">postcraft_user</span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-5">{text}</p>
      </div>
    </div>
  )
}

function LinkedInPreview({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 max-w-sm mx-auto shadow-lg text-black">
      <div className="flex items-center gap-2 mb-3">
        {AVATAR}
        <div>
          <div className="font-semibold text-sm">PostCraft User</div>
          <div className="text-xs text-slate-500">Product Manager · 1st</div>
        </div>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
      <div className="flex gap-4 mt-3 pt-3 border-t border-slate-200 text-slate-500">
        <button className="flex items-center gap-1 text-xs hover:text-blue-600"><ThumbsUp className="w-3.5 h-3.5" /> Нравится</button>
        <button className="flex items-center gap-1 text-xs hover:text-blue-600"><MessageCircle className="w-3.5 h-3.5" /> Комментарий</button>
        <button className="flex items-center gap-1 text-xs hover:text-blue-600"><Send className="w-3.5 h-3.5" /> Поделиться</button>
      </div>
    </div>
  )
}

function TelegramPreview({ text }: { text: string }) {
  return (
    <div className="bg-[#17212b] rounded-2xl p-4 max-w-sm mx-auto shadow-lg">
      <div className="flex justify-end">
        <div className="bg-[#2b5278] rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[85%]">
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
          <div className="text-right text-[10px] text-blue-300 mt-1">✓✓</div>
        </div>
      </div>
    </div>
  )
}

function FacebookPreview({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 max-w-sm mx-auto shadow-lg text-black">
      <div className="flex items-center gap-2 mb-3">
        {AVATAR}
        <div>
          <div className="font-semibold text-sm">PostCraft User</div>
          <div className="text-xs text-slate-500">Только что · 🌍</div>
        </div>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
      <div className="flex gap-4 mt-3 pt-3 border-t border-slate-200 text-slate-500">
        <button className="flex items-center gap-1 text-xs hover:text-blue-600"><ThumbsUp className="w-3.5 h-3.5" /> Нравится</button>
        <button className="flex items-center gap-1 text-xs hover:text-blue-600"><MessageCircle className="w-3.5 h-3.5" /> Комментарий</button>
        <button className="flex items-center gap-1 text-xs hover:text-blue-600"><Send className="w-3.5 h-3.5" /> Поделиться</button>
      </div>
    </div>
  )
}

function TikTokPreview({ text }: { text: string }) {
  return (
    <div className="bg-black rounded-2xl overflow-hidden max-w-sm mx-auto shadow-lg aspect-[9/16] relative flex items-end p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 to-blue-900/60" />
      <div className="relative z-10 w-full">
        <div className="flex items-center gap-2 mb-2">
          {AVATAR}
          <span className="text-white font-semibold text-sm">@postcraft_user</span>
        </div>
        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">{text}</p>
      </div>
    </div>
  )
}

export function PostPreview({ text, platform }: Props) {
  const charLimit = CHAR_LIMITS[platform]
  const overLimit = charLimit !== null && text.length > charLimit

  return (
    <div className="w-full">
      {overLimit && (
        <p className="text-red-400 text-xs mb-2 text-center">
          Превышен лимит: {text.length}/{charLimit}
        </p>
      )}
      {platform === 'twitter' && <TwitterPreview text={text} />}
      {platform === 'instagram' && <InstagramPreview text={text} />}
      {platform === 'linkedin' && <LinkedInPreview text={text} />}
      {platform === 'telegram' && <TelegramPreview text={text} />}
      {platform === 'facebook' && <FacebookPreview text={text} />}
      {platform === 'tiktok' && <TikTokPreview text={text} />}
    </div>
  )
}
