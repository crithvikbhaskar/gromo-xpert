export async function POST(request) {
    const { product, lead } = await request.json();
  
    const prompt = `Create a friendly pitch message in ${lead.language} for ${lead.name} from ${lead.location} about ${product}.`;
  
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.0",
        messages: [
          { role: "system", content: "You are a helpful financial sales assistant." },
          { role: "user", content: prompt },
        ],
      }),
    });
  
    const data = await openaiRes.json();
    const pitch = data.choices?.[0]?.message?.content || "No pitch generated.";
  
    return new Response(JSON.stringify({ pitch }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }