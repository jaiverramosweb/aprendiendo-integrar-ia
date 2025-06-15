// Importar dependencias
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

// Cargar configuracion de api key
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Servir la pagina estatica
app.use("/", express.static("public"));

// Middleware procesar json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Instrancia openAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Ruta

const context = "Eres un asistente de soporte de un supermercado virtual";

let conversation = [];

app.post("/api/chatbot", async (req, res) => {
    const { userId, message } = req.body;

    if(!message) return res.status(404).json({ error: "No se envio un mensaje" });

    if (!conversation[userId]) {
        conversation[userId] = [];
    }

    conversation[userId].push({ role: 'user', content: message });
    
    // llamar LLM
    try {
        const complation = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: context },
                { role: 'system', content: 'Debes de responder de forma corta y concisa' },
                ...conversation[userId]
            ],
            max_tokens: 200
        });

        const reply = complation.choices[0].message.content;

        // Liminte numnero de mensajes
        if (conversation[userId].length > 12) {
            conversation[userId] = conversation[userId].slice(-10);
        }

        conversation[userId].push({ role: 'assistant', content: reply });

        res.status(200).json({
            reply
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Error al traducir el texto"
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`));
