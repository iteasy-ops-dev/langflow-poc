'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { callLangflowAPI } from '@/lib/langflow'
import { getSettings } from '@/lib/settings'
import Markdown from '@/components/Markdown'
import { extractTextFromPDF } from '@/lib/pdf'

export default function SummarizePage() {
  const [documentText, setDocumentText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [flowId, setFlowId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')

  useEffect(() => {
    const settings = getSettings()
    setFlowId(settings.documentSummaryFlowId)
    setApiKey(settings.apiKey || '')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!documentText.trim() || isLoading) return

    if (!flowId) {
      alert('Flow ID가 설정되지 않았습니다. 설정 페이지에서 Flow ID를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setSummary('')

    try {
      const response = await callLangflowAPI(flowId, documentText, apiKey)
      setSummary(response)
    } catch (error) {
      setSummary('문서 요약 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      if (file.type === 'application/pdf') {
        const text = await extractTextFromPDF(file)
        setDocumentText(text)
        setUploadedFileName(file.name)
      } else {
        const reader = new FileReader()
        reader.onload = (event) => {
          const text = event.target?.result as string
          setDocumentText(text)
          setUploadedFileName(file.name)
        }
        reader.readAsText(file, 'UTF-8')
      }
    } catch (error) {
      alert('파일을 읽는 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setDocumentText('')
    setUploadedFileName('')
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
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

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              📝 기술 문서 요약
            </h1>
            <p className="text-gray-600">
              복잡한 기술 문서를 핵심만 간추려 제공합니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                문서 파일 업로드 (PDF, TXT, MD)
              </label>
              {!uploadedFileName ? (
                <div>
                  <input
                    type="file"
                    accept=".txt,.md,.pdf,application/pdf"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  {isUploading && (
                    <p className="text-sm text-blue-600 mt-2">파일을 읽는 중...</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm font-medium text-green-900">{uploadedFileName}</span>
                    <span className="text-xs text-green-600">({documentText.length.toLocaleString()} 자)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !documentText.trim()}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? '요약 생성 중...' : '문서 요약하기'}
            </button>
          </form>

          {(summary || isLoading) && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">요약 결과</h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <Markdown content={summary} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
