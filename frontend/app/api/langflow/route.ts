import { NextRequest, NextResponse } from 'next/server'

const LANGFLOW_API_URL = process.env.LANGFLOW_API_URL || 'http://localhost:7860'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { flowId, input, apiKey, tweaks } = body

    if (!flowId) {
      return NextResponse.json(
        { error: 'flowId is required' },
        { status: 400 }
      )
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (apiKey) {
      headers['x-api-key'] = apiKey
    }

    const response = await fetch(`${LANGFLOW_API_URL}/api/v1/run/${flowId}?stream=false`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        input_value: input,
        output_type: 'chat',
        input_type: 'chat',
        tweaks: tweaks || {},
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `Langflow API error: ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error calling Langflow API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
