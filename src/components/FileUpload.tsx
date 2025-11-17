import React, { useRef } from 'react'
import { cn, createSafeBlobURL } from '../lib/utils'
import { usePDFStore } from '../store/pdfStore'
import { PDFFile } from '../types/pdf'

interface FileUploadProps { className?: string }

export const FileUpload: React.FC<FileUploadProps> = ({ className }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { addFiles } = usePDFStore()

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const items: PDFFile[] = []
    for (const [idx, f] of Array.from(fileList).entries()) {
      if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) continue
      const buffer = await f.arrayBuffer()
      const url = createSafeBlobURL(buffer, 'application/pdf')
      items.push({
        id: `${f.name}_${f.lastModified}_${idx}`,
        name: f.name,
        size: f.size,
        type: f.type || 'application/pdf',
        lastModified: f.lastModified,
        url,
        pageCount: 0,
        formatType: 'other'
      })
    }
    if (items.length > 0) addFiles(items)
  }


  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="block w-full text-sm"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
        onClick={() => inputRef.current?.click()}
      >
        选择PDF文件
      </button>
    </div>
  )
}