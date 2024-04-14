const inp = document.getElementById('chat-input');
const sendBtn = document.getElementById('send');
const chatHistory = document.querySelector('.chat-history');

sendBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const userMessage = inp.value.trim();
  inp.value = '';
  displayMessage('You',userMessage);
  // Send the user message to the server
  const response = await fetch('/blogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
  });

  if (response.ok) {
    // Display the server response in the chat history
    const message = await response.text();
    displayMessage('Dr. Dreamy Doodles', message);
  } else {
    console.error('Failed to fetch AI response');
  }
});

function displayMessage(sender, message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.style.fontSize = '23px';
  messageDiv.textContent = `${sender}: ${message}`;
  chatHistory.appendChild(messageDiv);

  const lineBreak = document.createElement('br');
  chatHistory.appendChild(lineBreak);

  chatHistory.scrollTop = chatHistory.scrollHeight;
}
