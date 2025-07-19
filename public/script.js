// Blokada devtools i ctrl+u
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
    e.preventDefault();
  }
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
    e.preventDefault();
  }
});

// Obsługa wysyłania wiadomości
const form = document.getElementById("messageForm");
if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const msg = document.getElementById("message").value;
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: msg })
    });
    document.getElementById("message").value = '';
    loadMessages();
  });
}

async function loadMessages() {
  const res = await fetch('/api/messages');
  const messages = await res.json();
  const container = document.getElementById("messages") || document.getElementById("adminMessages");
  if (!container) return;

  container.innerHTML = '';
  messages.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<p>${m.text}</p>`;
    if (container.id === "adminMessages") {
      div.innerHTML += `
        <button onclick="deleteMessage(${i})">Usuń</button>
        <button onclick="editMessage(${i})">Edytuj</button>
      `;
    }
    container.appendChild(div);
  });
}

async function deleteMessage(i) {
  await fetch(`/api/messages/${i}`, { method: 'DELETE' });
  loadMessages();
}

async function editMessage(i) {
  const newText = prompt("Nowa treść:");
  if (newText) {
    await fetch(`/api/messages/${i}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText })
    });
    loadMessages();
  }
}

// Admin logowanie
const loginForm = document.getElementById("adminLoginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const password = document.getElementById("adminPassword").value;
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if ((await res.json()).success) {
      document.getElementById("adminLoginForm").style.display = "none";
      document.getElementById("adminPanel").style.display = "block";
      loadMessages();
    } else {
      alert("Nieprawidłowe hasło");
    }
  });
}

window.onload = loadMessages;
