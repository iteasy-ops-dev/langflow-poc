'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { callLangflowAPI } from '@/lib/langflow'
import { getSettings } from '@/lib/settings'
import Markdown from '@/components/Markdown'
import Papa from 'papaparse'

interface AnalysisResult {
  severity: 'critical' | 'warning' | 'info' | 'normal'
  findings: string[]
  recommendation: string
}

export default function LogAnalysisPage() {
  const [logText, setLogText] = useState('')
  const [analysis, setAnalysis] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [flowId, setFlowId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')

  useEffect(() => {
    const settings = getSettings()
    setFlowId(settings.logAnalysisFlowId)
    setApiKey(settings.apiKey || '')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!logText.trim() || isLoading) return

    if (!flowId) {
      alert('Flow ID가 설정되지 않았습니다. 설정 페이지에서 Flow ID를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setAnalysis('')

    try {
      const response = await callLangflowAPI(flowId, logText, apiKey)
      setAnalysis(response)
    } catch (error) {
      setAnalysis('로그 분석 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text()
        const json = JSON.parse(text)
        setLogText(JSON.stringify(json, null, 2))
        setUploadedFileName(file.name)
      } else if (file.name.endsWith('.csv')) {
        const text = await file.text()
        Papa.parse(text, {
          complete: (results) => {
            const formatted = results.data
              .map((row: any) => Array.isArray(row) ? row.join(', ') : JSON.stringify(row))
              .join('\n')
            setLogText(formatted)
            setUploadedFileName(file.name)
          },
          error: (error) => {
            alert('CSV 파일 파싱 오류: ' + error.message)
          }
        })
      } else {
        const reader = new FileReader()
        reader.onload = (event) => {
          const text = event.target?.result as string
          setLogText(text)
          setUploadedFileName(file.name)
        }
        reader.readAsText(file)
      }
    } catch (error) {
      alert('파일을 읽는 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setLogText('')
    setUploadedFileName('')
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const sampleLogs = `2025-10-14 12:00:01 INFO Server started on port 8080
2025-10-14 12:00:15 INFO User login: user@example.com
2025-10-14 12:05:23 WARNING High memory usage: 85%
2025-10-14 12:10:45 ERROR Database connection timeout
2025-10-14 12:10:46 ERROR Failed to execute query: Connection lost
2025-10-14 12:15:30 WARNING CPU usage spike: 92%`

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
              🔍 서버 로그 분석
            </h1>
            <p className="text-gray-600">
              서버 로그를 분석하여 이상 징후와 개선 사항을 제안합니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                로그 파일 업로드 (LOG, TXT, JSON, CSV)
              </label>
              {!uploadedFileName ? (
                <div>
                  <input
                    type="file"
                    accept=".log,.txt,.json,.csv,application/json,text/csv"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  {isUploading && (
                    <p className="text-sm text-blue-600 mt-2">파일을 읽는 중...</p>
                  )}
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setLogText(sampleLogs)
                        setUploadedFileName('샘플 로그')
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      샘플 로그 사용
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm font-medium text-green-900">{uploadedFileName}</span>
                    <span className="text-xs text-green-600">({logText.split('\n').length} 라인)</span>
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
              disabled={isLoading || !logText.trim()}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? '분석 중...' : '로그 분석하기'}
            </button>
          </form>

          {(analysis || isLoading) && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">분석 결과</h2>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <h3 className="font-bold text-blue-900 mb-2">AI 분석 리포트</h3>
                    <Markdown content={analysis} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
