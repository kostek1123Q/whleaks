const API_BASE = "https://154d944d-95ea-4c3e-b6c0-c708536c26b9-00-10mmlc428efua.picard.replit.dev";

let isAdmin = false;

document.addEventListener("DOMContentLoaded", () => {
  loadMessages();

  document.getElementById("postForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("messageInput").value.trim();
    if (!text) return;

    await fetch(`${API_BASE}/api/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    document.getElementById("messageInput").value = "";
    loadMessages();
  });

  document.getElementById("adminLoginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("adminPassword").value;

    const res = await fetch(`${API_BASE}/api/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    if (data.success) {
      isAdmin = true;
      document.getElementById("adminSection").style.display = "none";
      loadMessages();
    } else {
      alert("Błędne hasło");
    }
  });
});

async function loadMessages() {
  const res = await fetch(`${API_BASE}/api/messages`);
  const messages = await res.json();
  const container = document.getElementById("messages");
  container.innerHTML = "";

  messages.forEach((msg, i) => {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `
      <p>${msg.text}</p>
      ${isAdmin ? `
        <button onclick="editMessage(${i})">✏️ Edytuj</button>
        <button onclick="deleteMessage(${i})">🗑️ Usuń</button>
      ` : ""}
    `;
    container.appendChild(div);
  });
}

async function deleteMessage(id) {
  if (!confirm("Na pewno usunąć?")) return;
  await fetch(`${API_BASE}/api/messages/${id}`, { method: "DELETE" });
  loadMessages();
}

function editMessage(id) {
  const newText = prompt("Nowa treść ogłoszenia:");
  if (!newText) return;

  fetch(`${API_BASE}/api/messages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText })
  }).then(loadMessages);
}
