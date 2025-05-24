import * as pdfjsLib from 'pdfjs-dist';
import PdfWorker from '../pdfWorker.js?worker'; // a Worker class

export async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();

  // Create an instance of the worker and pass it explicitly
  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    worker: new PdfWorker(), // ✅ correct way to use Vite worker
  });

  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);

    fullText += strings.join(' ') + '\n';
  }

  return fullText;
}
