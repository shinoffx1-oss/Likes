const form = document.querySelector("#form");
const uidInput = document.querySelector("#uid");
const btn = document.querySelector("#btn");
const result = document.querySelector("#result");

function esc(v) {
  return String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const uid = uidInput.value.trim();

  if (!/^\d{5,15}$/.test(uid)) {
    showError("UID inválido. Use somente 5 a 15 números.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Enviando...";
  result.classList.remove("hidden");
  result.innerHTML = `<div class="status">Consultando a API V2...</div><p>Aguarde a resposta.</p>`;

  try {
    const response = await fetch(`/api/like?uid=${encodeURIComponent(uid)}`);
    const data = await response.json();

    if (data.status === "success") {
      const p = data.player || {};
      const l = data.likes || {};
      result.innerHTML = `
        <div class="status ok">✓ ${esc(data.status_envio || "Likes enviados com sucesso!")}</div>
        <div class="player">
          <div class="card"><span>Jogador</span><strong>${esc(p.nickname || "-")}</strong></div>
          <div class="card"><span>UID</span><strong>${esc(p.uid || uid)}</strong></div>
          <div class="card"><span>Nível</span><strong>${esc(p.level || "-")}</strong></div>
          <div class="card"><span>Likes antes</span><strong>${esc(l.antes || "-")}</strong></div>
          <div class="card"><span>Adicionados</span><strong>${esc(l.adicionados || "-")}</strong></div>
          <div class="card"><span>Likes depois</span><strong>${esc(l.depois || "-")}</strong></div>
        </div>`;
    } else {
      const msg = data.mensagem || data.message || data.detalhes?.[0] || "A API não confirmou o envio.";
      showError(msg);
    }
  } catch {
    showError("Erro ao falar com o servidor.");
  } finally {
    btn.disabled = false;
    btn.textContent = "Enviar likes";
  }
});

function showError(msg) {
  result.classList.remove("hidden");
  result.innerHTML = `<div class="status bad">✕ ${esc(msg)}</div>`;
}
