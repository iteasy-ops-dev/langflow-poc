export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import('@bundled-es-modules/pdfjs-dist')
    
    const getDocument = pdfjsLib.getDocument || (pdfjsLib as any).default?.getDocument
    const GlobalWorkerOptions = pdfjsLib.GlobalWorkerOptions || (pdfjsLib as any).default?.GlobalWorkerOptions
    
    if (GlobalWorkerOptions) {
      GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/build/pdf.worker.min.js'
    }
    
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      
      fullText += pageText + '\n\n'
    }
    
    return fullText.trim()
  } catch (error) {
    console.error('PDF 파싱 오류:', error)
    throw new Error('PDF 파일을 읽는 중 오류가 발생했습니다.')
  }
}
