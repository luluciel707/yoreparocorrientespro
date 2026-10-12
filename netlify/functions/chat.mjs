
import { GoogleGenAI } from "@google/genai";

const instructions = `
Sos el asistente de Yo Reparo Corrientes.
Respondé en español, de forma amable, clara y práctica.

Ayudá con consultas sobre reparación de celulares,
aire acondicionado y servicios para el hogar.

Precios confirmados:
- Instalación de aire acondicionado: ARS 150.000.
- Retiro de aire acondicionado: ARS 100.000.

No inventes otros precios. Para otros trabajos, indicá
que se debe consultar el presupuesto.

Por seguridad, no indiques que una persona sin experiencia
manipule instalaciones eléctricas, gas ni baterías peligrosas.
`;

export default async (request) => {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Método no permitido" },
      { status: 405 }
    );
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Falta configurar GEMINI_API_KEY en Netlify." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const history = Array.isArray(body.messages)
      ? body.messages
      : [];

    const contents = history
      .filter(
        (m) =>
          ["user", "assistant"].includes(m.role) &&
          typeof m.content === "string" &&
          m.content.trim()
      )
      .slice(-20)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    if (!contents.length) {
      return Response.json(
        { error: "Escribí un mensaje para comenzar." },
        { status: 400 }
      );
    }

    const gemini = new GoogleGenAI({ apiKey });

    const result = await gemini.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: instructions,
        maxOutputTokens: 650,
      },
    });

    const reply = String(result.text || "").trim();

    if (!reply) {
      return Response.json(
        { error: "Gemini no devolvió una respuesta." },
        { status: 502 }
      );
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Error en la función chat:", error);

    return Response.json(
      { error: "No se pudo procesar el mensaje. Intentá de nuevo." },
      { status: 500 }
    );
  }
};
