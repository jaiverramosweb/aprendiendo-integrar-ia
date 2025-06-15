const sendButton = document.getElementById("sendButton");
const inputText = document.getElementById("inputText");
const messageContainer = document.querySelector(".chat_messages");

const userId = Date.now() + Math.floor(777 + Math.random() * 1000);

inputText.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sendButton.click();
    }
})

sendButton.addEventListener("click", async () => {
    if (!inputText.value.trim()) return false;        
    
    messageContainer.innerHTML += `<div class="chat_messages_ms chat_messages_user">${inputText.value.trim()}</div>`;

    try {
        const response = await fetch("/api/chatbot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                message: inputText.value.trim()
            })
        });

        const data = await response.json();

        messageContainer.innerHTML += `<div class="chat_messages_ms chat_messages_bot">Bot: ${data.reply}</div>`;

        inputText.value = "";

    } catch (error) {
        console.log(error);
    }
    
})