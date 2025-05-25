import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fetch from 'node-fetch';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

async function extractTextFromPDF(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

export async function generateSummary(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const text = await extractTextFromPDF(req.file.path);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'PDF is empty or unreadable' });
    }
const prompt = `
You are an expert technical writer and summarizer. You will be given the full raw content of a PDF.

Your task is to create a **clean, structured summary** that meets the following instructions:

1. Use clear section headers (like ## Topic Name).
2. Use bullet points (• or -) for clarity.
3. Keep each point concise and beginner-friendly.
4. Cover **all key ideas, concepts, analogies, and technical parts** from the content.
5. Avoid merging too much information into large paragraphs.
6. Maintain the **original flow** of content from the document.
7. Do **not skip any technical or educational information**.
8. The output should feel like a high-quality study note that anyone can easily understand, even without reading the original PDF.

---
Here is the PDF content:
${text}
`;


    const response = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: "sonar-pro", // Use your allowed model
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();

    const summary = data?.choices?.[0]?.message?.content || "No summary available";

    res.status(200).json({
      message: 'Summary generated successfully',
      summary: summary,
    });
  } catch (error) {
    console.error('Error in generateSummary:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
