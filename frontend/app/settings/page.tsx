'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSettings, saveSettings, clearSettings, type FlowSettings } from '@/lib/settings'

export default function SettingsPage() {
  const [settings, setSettings] = useState<FlowSettings>({
    chatbotFlowId: '',
    documentSummaryFlowId: '',
    logAnalysisFlowId: '',
    apiKey: '',
    langflowUrl: 'http://localhost:7860',
  })
  const [isSaved, setIsSaved] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    const loaded = getSettings()
    setSettings(loaded)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      saveSettings(settings)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 3000)
    } catch (error) {
      alert('설정 저장에 실패했습니다.')
    }
  }

  const handleClear = () => {
    if (confirm('모든 설정을 초기화하시겠습니까?')) {
      clearSettings()
      setSettings({
        chatbotFlowId: '',
        documentSummaryFlowId: '',
        logAnalysisFlowId: '',
        apiKey: '',
        langflowUrl: 'http://localhost:7860',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← 대시보드로 돌아가기
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              ⚙️ Langflow 설정
            </h1>
            <p className="text-gray-600">
              Langflow API 연동에 필요한 정보를 입력하세요
            </p>
          </div>

          {isSaved && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              ✓ 설정이 저장되었습니다
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langflow URL
              </label>
              <input
                type="text"
                value={settings.langflowUrl}
                onChange={(e) => setSettings({ ...settings, langflowUrl: e.target.value })}
                placeholder="http://localhost:7860"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              />
              <p className="text-sm text-gray-500 mt-1">
                Langflow 서버 주소
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key (선택사항)
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder="Langflow API Key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-20 text-gray-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800"
                >
                  {showApiKey ? '숨기기' : '보기'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Langflow에서 인증이 필요한 경우에만 입력
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Flow IDs
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💬 챗봇 Flow ID
                  </label>
                  <input
                    type="text"
                    value={settings.chatbotFlowId}
                    onChange={(e) => setSettings({ ...settings, chatbotFlowId: e.target.value })}
                    placeholder="예: abc123-def456-ghi789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 문서 요약 Flow ID
                  </label>
                  <input
                    type="text"
                    value={settings.documentSummaryFlowId}
                    onChange={(e) => setSettings({ ...settings, documentSummaryFlowId: e.target.value })}
                    placeholder="예: jkl012-mno345-pqr678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔍 로그 분석 Flow ID
                  </label>
                  <input
                    type="text"
                    value={settings.logAnalysisFlowId}
                    onChange={(e) => setSettings({ ...settings, logAnalysisFlowId: e.target.value })}
                    placeholder="예: stu901-vwx234-yz5678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                설정 저장
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                초기화
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Flow ID 찾는 방법</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Langflow 웹 인터페이스 접속 (http://localhost:7860)</li>
              <li>원하는 Flow 선택</li>
              <li>브라우저 주소창에서 마지막 부분의 ID 복사</li>
              <li>예: /flow/<strong>abc123-def456</strong> → abc123-def456가 Flow ID</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
