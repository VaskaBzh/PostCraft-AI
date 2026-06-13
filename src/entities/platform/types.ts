export type Platform = 'twitter' | 'instagram' | 'linkedin' | 'facebook' | 'tiktok' | 'telegram'

export type Tone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'bold'

export type Length = 'short' | 'medium' | 'long'

export interface PlatformConfig {
  id: Platform
  name: string
  icon: string
  color: string
  gradient: string
  charLimit: number | null
  description: string
}

export interface ToneConfig {
  id: Tone
  name: string
  emoji: string
  description: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  platform: Platform
  tone: Tone
  timestamp: Date
  isStreaming?: boolean
}

export interface AppSettings {
  platform: Platform
  tone: Tone
  length: Length
  includeHashtags: boolean
  includeEmojis: boolean
  language: string
}

export type ModelId = 'claude-haiku-4-5' | 'claude-sonnet-4-6' | 'claude-opus-4-8'

export interface ModelOption {
  id: ModelId
  name: string
  description: string
  speed: 'fast' | 'balanced' | 'quality'
}

export interface Template {
  id: string
  name: string
  prompt: string
  settings: Pick<AppSettings, 'platform' | 'tone' | 'length'>
  createdAt: number
}
