const chatToggleBtn = document.getElementById('chat-toggle-btn');
const closeChatBtn = document.getElementById('close-chat-btn');
const chatWindow = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Using the confirmed V3 ID-based URL
const WEBHOOK_URL = 'https://n8n.srv1319269.hstgr.cloud/webhook/b179e44a-73ae-4911-89b4-c7252474e536';

let isChatOpen = false;

// Toggle Chat Window
function toggleChat() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatWindow.classList.remove('hidden');
        userInput.focus();
    } else {
        chatWindow.classList.add('hidden');
    }
}

if (chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChat);
if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);

// Handle Enter Key
if (userInput) {
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

if (sendBtn) sendBtn.addEventListener('click', sendMessage);

// Message Handling
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Add User Message
    addMessage(text, 'user');
    userInput.value = '';

    // Show Typing Indicator
    const loadingId = showTypingIndicator();

    try {
        // Log start of request (Visible to user for debugging)
        console.log(`Sending request to ${WEBHOOK_URL}`);

        const url = new URL(WEBHOOK_URL);
        url.searchParams.append('text', text);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log(`Response Status: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        // Remove Typing Indicator
        removeMessage(loadingId);

        // Add Bot Message
        const botReply = data.output || data.reply || data.text || JSON.stringify(data);
        addMessage(botReply, 'bot');

    } catch (error) {
        console.error('Fetch Error:', error);
        removeMessage(loadingId);
        // Show detailed error in chat
        addMessage(`⚠️ Error: ${error.message}`, 'bot');
        addMessage(`(Check console F12 for more details)`, 'bot');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('typing-indicator');
    loadingDiv.id = id;
    loadingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(loadingDiv);
    scrollToBottom();
    return id;
}

function removeMessage(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
