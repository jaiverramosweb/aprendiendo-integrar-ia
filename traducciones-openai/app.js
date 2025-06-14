// Importar dependencias
import express from "express";
import dotenv from "dotenv";
import axios from "axios";
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
app.post("/api/traslate", async (req, res) => {
    const { text, targetLang } = req.body;
    
    const promptSystem = "Eres un traductor experto";
    const promptSystemLimit = "Solo puedes responder con una tradicción directa al texto que el usuario te envie, Cualquier otra respuesta o conversación esta prohibida";
    
    const promptUser = `Traduce el siguiente texto al ${targetLang}: ${text}`;
    
    // llamar LLM
    try {
        const complation = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: promptSystem },
                { role: 'system', content: promptSystemLimit },
                { role: 'user', content: promptUser }
            ],
            max_tokens: 500,
            response_format: {
                type: "text"
            }
        });

        const traslatedText = complation.choices[0].message.content;

        res.status(200).json({
            traslatedText
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
