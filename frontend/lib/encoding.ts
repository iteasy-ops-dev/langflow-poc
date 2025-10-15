export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const text = event.target?.result as string
      resolve(text)
    }
    
    reader.onerror = () => {
      reject(new Error('파일을 읽는 중 오류가 발생했습니다.'))
    }
    
    reader.readAsText(file, 'UTF-8')
  })
}

export async function detectEncoding(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer).slice(0, 100)
  
  if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
    return 'UTF-8'
  }
  
  if (bytes[0] === 0xFE && bytes[1] === 0xFF) {
    return 'UTF-16BE'
  }
  
  if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
    return 'UTF-16LE'
  }
  
  return 'UTF-8'
}

export async function readFileWithEncoding(file: File, encoding?: string): Promise<string> {
  if (!encoding) {
    encoding = await detectEncoding(file)
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const text = event.target?.result as string
      resolve(text)
    }
    
    reader.onerror = () => {
      reject(new Error('파일을 읽는 중 오류가 발생했습니다.'))
    }
    
    reader.readAsText(file, encoding)
  })
}
