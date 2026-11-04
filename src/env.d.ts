// Waku types import.meta.env as ImportMetaEnv but declares no such interface, so without this file the key reads as any.
interface ImportMetaEnv {
  readonly WAKU_PUBLIC_AMPLITUDE_API_KEY?: string
}
