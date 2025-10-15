'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { callLangflowAPI, LangflowMessage } from '@/lib/langflow'
import { getSettings } from '@/lib/settings'
import Markdown from '@/components/Markdown'

export default function ChatbotPage() {
  const [messages, setMessages] = useState<LangflowMessage[]>([
    {
      message: '안녕하세요! ITEASY 고객 지원 챗봇입니다. 서버 호스팅, 클라우드 서비스에 대해 무엇이든 물어보세요.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [flowId, setFlowId] = useState('')
  const [apiKey, setApiKey] = useState('')

  useEffect(() => {
    const settings = getSettings()
    setFlowId(settings.chatbotFlowId)
    setApiKey(settings.apiKey || '')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    if (!flowId) {
      alert('Flow ID가 설정되지 않았습니다. 설정 페이지에서 Flow ID를 입력해주세요.')
      return
    }

    const userMessage: LangflowMessage = {
      message: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await callLangflowAPI(flowId, input, apiKey)

      const botMessage: LangflowMessage = {
        message: response,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage: LangflowMessage = {
        message: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← 대시보드로 돌아가기
          </Link>
          <Link
            href="/settings"
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            ⚙️ 설정
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <h1 className="text-3xl font-bold text-white">💬 AI 고객 지원 챗봇</h1>
            <p className="text-blue-100 mt-2">
              ITEASY 서비스에 대해 궁금한 점을 물어보세요
            </p>
          </div>

          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap text-white">{msg.message}</p>
                  ) : (
                    <Markdown content={msg.message} />
                  )}
                  <p
                    className={`text-xs mt-2 ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString('ko-KR')}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                전송
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
