
const messagesContainer = document.querySelector('#chat-messages');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const sendButton = document.querySelector('#chat-send');
const suggestions = document.querySelector('#chat-suggestions');

const history = [];
let waiting = false;

function addMessage(text, role) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${
    role === 'user' ? 'user-message' : 'bot-message'
  }`;

  // textContent evita interpretar respuestas como HTML.
  bubble.textContent = text;
  messagesContainer.appendChild(bubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  return bubble;
}

async function sendMessage(rawText) {
  const text = rawText.trim();

  if (!text || waiting) return;

  waiting = true;
  chatInput.disabled = true;
  sendButton.disabled = true;

  addMessage(text, 'user');
  history.push({ role: 'user', content: text });

  if (suggestions) suggestions.hidden = true;

  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.textContent = 'El asistente está escribiendo...';
  messagesContainer.appendChild(typing);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  try {

const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: history.slice(-20) })
});

const responseText = await response.text();

let payload;

try {
  payload = JSON.parse(responseText);
} catch {
  throw new Error(
    `El servidor devolvió una respuesta vacía o inválida (HTTP ${response.status}).`
  );
}

if (!response.ok) {
  throw new Error(
    payload.error || `Error del servidor (HTTP ${response.status}).`
  );
}


    if (!response.ok) {
      throw new Error(
        payload.error || 'No se pudo obtener una respuesta.'
      );
    }

    if (typeof payload.reply !== 'string' || !payload.reply.trim()) {
      throw new Error('La IA devolvió una respuesta vacía.');
    }

    history.push({
      role: 'assistant',
      content: payload.reply
    });

    addMessage(payload.reply, 'assistant');
  } catch (error) {
    // Retirar el mensaje fallido del historial para poder reintentarlo.
    history.pop();

    addMessage(
      `No pude responder en este momento. ${error.message} Podés intentar nuevamente.`,
      'assistant'
    );
  } finally {
    typing.remove();
    waiting = false;
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.focus();
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

chatForm?.addEventListener('submit', event => {
  event.preventDefault();

  const text = chatInput.value;
  if (!text.trim() || waiting) return;

  chatInput.value = '';
  sendMessage(text);
});

suggestions?.addEventListener('click', event => {
  const button = event.target.closest('button[data-message]');
  if (!button || waiting) return;

  sendMessage(button.dataset.message);
});

chatInput?.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});
