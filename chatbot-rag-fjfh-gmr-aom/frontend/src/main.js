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
    try {
    const r = fetch("http://localhost:3000/consultar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta: message })
    }).then(r => r.json());

    //showStatus(r.respuesta || "Ok", r.ok);
    botMsg.textContent = r.respuesta;
  } catch {
    botMsg.textContent = "Error al conectar con el servidor.";
  }
    chatBox.appendChild(botMsg);

    chatBox.scrollTop = chatBox.scrollHeight;
    userInput.value = '';
  }
});

// Permitir enviar con Enter
userInput.addEventListener('keypress', (e) => {
  if(e.key === 'Enter') sendBtn.click();
});
