import * as pdfjsLib from 'pdfjs-dist';

// 配置PDF.js worker - 使用本地worker文件
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface PDFPageInfo {
  pageNumber: number;
  width: number;
  height: number;
  textContent: string;
}

export interface PDFDocumentInfo {
  numPages: number;
  pages: PDFPageInfo[];
}

export class PDFService {
  /**
   * 获取PDF文档信息
   */
  static async getDocumentInfo(file: File | string): Promise<PDFDocumentInfo> {
    try {
      let documentSource: any;
      
      if (file instanceof File) {
        // 将File对象转换为ArrayBuffer
        documentSource = await file.arrayBuffer();
      } else {
        documentSource = file;
      }
      
      const loadingTask = pdfjsLib.getDocument(documentSource);
      const pdf = await loadingTask.promise;
      
      const pages: PDFPageInfo[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        pages.push({
          pageNumber: i,
          width: page.view[2],
          height: page.view[3],
          textContent: text
        });
      }
      
      return {
        numPages: pdf.numPages,
        pages
      };
    } catch (error) {
      console.error('PDF解析错误:', error);
      throw new Error('无法解析PDF文件');
    }
  }

  /**
   * 获取PDF页面缩略图
   */
  static async getPageThumbnail(
    file: File | string, 
    pageNumber: number, 
    scale: number = 0.5
  ): Promise<string> {
    try {
      let documentSource: any;
      
      if (file instanceof File) {
        documentSource = await file.arrayBuffer();
      } else {
        documentSource = file;
      }
      
      const loadingTask = pdfjsLib.getDocument(documentSource);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(pageNumber);
      
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas
      };
      
      await page.render(renderContext).promise;
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('生成缩略图错误:', error);
      throw new Error('无法生成页面缩略图');
    }
  }

  /**
   * 提取文本内容用于OCR分析
   */
  static extractTextForOCR(pages: PDFPageInfo[]): string {
    return pages.map(page => page.textContent).join('\n');
  }

  /**
   * 识别文档格式类型
   */
  static identifyFormatType(textContent: string): 'invoice' | 'ticket' | 'receipt' | 'other' {
    const lowerText = textContent.toLowerCase();
    
    // 发票关键词
    const invoiceKeywords = ['发票', 'invoice', '收据', 'receipt', '金额', 'amount'];
    // 车票关键词  
    const ticketKeywords = ['车票', 'ticket', '火车', 'train', '高铁', '高铁', '动车', 'd-train'];
    
    const hasInvoiceKeywords = invoiceKeywords.some(keyword => lowerText.includes(keyword));
    const hasTicketKeywords = ticketKeywords.some(keyword => lowerText.includes(keyword));
    
    if (hasInvoiceKeywords && hasTicketKeywords) {
      // 如果同时包含两种关键词，根据更具体的特征判断
      if (lowerText.includes('车次') || lowerText.includes('座位')) {
        return 'ticket';
      }
      return 'invoice';
    } else if (hasInvoiceKeywords) {
      return 'invoice';
    } else if (hasTicketKeywords) {
      return 'ticket';
    }
    
    return 'other';
  }
}