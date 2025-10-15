export interface LangflowMessage {
  message: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface LangflowResponse {
  outputs: Array<{
    outputs: Array<{
      results: {
        message: {
          text: string
          data?: {
            text: string
          }
        }
      }
      messages?: Array<{
        message: string
        type: string
      }>
    }>
  }>
}

export async function callLangflowAPI(
  flowId: string,
  input: string,
  apiKey?: string,
  tweaks?: Record<string, any>
): Promise<string> {
  try {
    const response = await fetch('/api/langflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flowId,
        input,
        apiKey,
        tweaks,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to call Langflow API')
    }

    const data: LangflowResponse = await response.json()
    
    const messageText = 
      data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ||
      data?.outputs?.[0]?.outputs?.[0]?.results?.message?.data?.text ||
      data?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message ||
      'No response from AI'

    return messageText
  } catch (error) {
    console.error('Langflow API call failed:', error)
    throw error
  }
}
