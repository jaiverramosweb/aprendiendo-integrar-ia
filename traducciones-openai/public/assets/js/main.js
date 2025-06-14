let sendButton = document.querySelector("#sendButton");

sendButton.addEventListener("click", async () => {
    // Texto a traducir
    let textInput = document.getElementById("inputText");
    const text = textInput.value.trim();
    if (!text) return false;

    // lenguage a traducir
    const targetLang = document.getElementById("fromLanguage").value;

    // Mensaje del usuario a la caja del mensaje
    const userMessage = document.createElement("div");
    userMessage.className = "chat_messages_ms chat_messages_user";
    userMessage.textContent = text;

    // vaciar el input
    textInput.value = "";
    
    const messageContainer = document.querySelector(".chat_messages");
    messageContainer.appendChild(userMessage);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    
    // peticion al backend
    try {

        const datos = {
            text,
            targetLang
        }

        console.log('datos enviados', datos)

        const resp = await fetch("/api/traslate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        })

        const data = await resp.json();

        // agregar el mensaje del backend al chat
        const botMessage = document.createElement("div");
        botMessage.className = "chat_messages_ms chat_messages_bot";
        botMessage.textContent = data.traslatedText;
        messageContainer.appendChild(botMessage);
        messageContainer.scrollTop = messageContainer.scrollHeight;

    } catch (error) {
        console.log(error)
    }
    
})