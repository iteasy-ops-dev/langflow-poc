export interface FlowSettings {
  chatbotFlowId: string
  documentSummaryFlowId: string
  logAnalysisFlowId: string
  apiKey?: string
  langflowUrl?: string
}

const DEFAULT_SETTINGS: FlowSettings = {
  chatbotFlowId: '',
  documentSummaryFlowId: '',
  logAnalysisFlowId: '',
  apiKey: '',
  langflowUrl: 'http://localhost:7860',
}

const STORAGE_KEY = 'langflow_settings'

export function getSettings(): FlowSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }

  return DEFAULT_SETTINGS
}

export function saveSettings(settings: Partial<FlowSettings>): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const current = getSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save settings:', error)
    throw error
  }
}

export function clearSettings(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear settings:', error)
  }
}
