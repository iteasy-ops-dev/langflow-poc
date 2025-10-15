import Link from 'next/link'

export default function Home() {
  const useCases = [
    {
      id: 'chatbot',
      title: 'AI 고객 지원 챗봇',
      description: 'ITEASY 서비스 관련 문의에 24/7 즉각 응답',
      icon: '💬',
      href: '/chatbot',
    },
    {
      id: 'summarize',
      title: '기술 문서 요약',
      description: '복잡한 기술 문서를 핵심만 간추려 제공',
      icon: '📝',
      href: '/summarize',
    },
    {
      id: 'log-analysis',
      title: '서버 로그 분석',
      description: '로그 패턴을 분석하여 이상 징후 탐지',
      icon: '🔍',
      href: '/log-analysis',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex justify-end mb-4">
            <Link
              href="/settings"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ⚙️ 설정
            </Link>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ITEASY AI 자동화 플랫폼
          </h1>
          <p className="text-xl text-gray-600">
            Langflow 기반 업무 자동화 솔루션
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase) => (
            <Link
              key={useCase.id}
              href={useCase.href}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="text-6xl mb-4">{useCase.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {useCase.title}
              </h2>
              <p className="text-gray-600">{useCase.description}</p>
            </Link>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-500">
          <p>Powered by Langflow & Next.js</p>
        </footer>
      </div>
    </div>
  )
}
