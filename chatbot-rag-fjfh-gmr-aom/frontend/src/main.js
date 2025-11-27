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

    // Llamada al servidor
    fetch("http://localhost:3000/consultar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta: message })
    })
    .then(response => response.json())
    .then(data => {

      // CREAS el mensaje del bot solo cuando ya tienes la respuesta
      const botMsg = document.createElement('div');
      botMsg.classList.add('message', 'bot-message');
      botMsg.textContent = data.respuesta || "No hay respuesta del servidor.";
      chatBox.appendChild(botMsg);

      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
      const botMsg = document.createElement('div');
      botMsg.classList.add('message', 'bot-message');
      botMsg.textContent = "❌ Error al conectar con el servidor.";
      chatBox.appendChild(botMsg);

      console.error(error);
      chatBox.scrollTop = chatBox.scrollHeight;
    });

    userInput.value = '';
  }
});


// Permitir enviar con Enter
userInput.addEventListener('keypress', (e) => {
  if(e.key === 'Enter') sendBtn.click();
});
