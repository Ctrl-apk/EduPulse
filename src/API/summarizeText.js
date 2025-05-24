export async function summarizeText(text) {
  const res = await fetch("http://localhost:5000/api/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error(`Failed to summarize: ${res.statusText}`);
  }

  const data = await res.json();
  return data.summary;
}
