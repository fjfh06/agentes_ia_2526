import './style.css'
import viteLogo from '/vite.svg'

// Ejemplo simple para agregar mensajes al chat
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', () => {
  const message = userInput.value.trim();
  if(message) {
    const userMsg = document.createElement('div');
    userMsg.classList.add('message', 'user-message');
    userMsg.textContent = message;
    chatBox.appendChild(userMsg);

    // Aquí se puede agregar la respuesta del bot
    const botMsg = document.createElement('div');
    botMsg.classList.add('message', 'bot-message');
    fetch("http://localhost:3000/consultar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta: message })
    })
    .then(response => response.json())
    .then(data => {
      botMsg.textContent = data.respuesta || "No hay respuesta del servidor.";
      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
      botMsg.textContent = "❌ Error al conectar con el servidor.";
      console.error(error);
      chatBox.scrollTop = chatBox.scrollHeight;
    });
    chatBox.appendChild(botMsg);

    chatBox.scrollTop = chatBox.scrollHeight;
    userInput.value = '';
  }
});

// Permitir enviar con Enter
userInput.addEventListener('keypress', (e) => {
  if(e.key === 'Enter') sendBtn.click();
});
