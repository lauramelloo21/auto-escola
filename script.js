// FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });

  // Endereço do backend — troque pela URL que o Render te der após o deploy
  // Exemplo: 'https://auto-escola-backend.onrender.com'
  const BACKEND_URL = 'https://SEU-BACKEND-AQUI.onrender.com';

  // Contact form — envia para o backend
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const submitBtn = form.querySelector('.submit-btn');
    const formMsg = document.getElementById('formMsg');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const res = await fetch(`${BACKEND_URL}/api/mensagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: document.getElementById('nome').value,
          telefone: document.getElementById('tel').value,
          categoria: document.getElementById('categoria').value,
          mensagem: document.getElementById('msg').value
        })
      });

      if (!res.ok) throw new Error('Falha no envio');

      formMsg.textContent = 'Recebemos sua solicitação! Vamos te chamar em breve.';
      formMsg.style.color = 'var(--green)';
      formMsg.style.display = 'block';
      form.reset();
    } catch (err) {
      formMsg.textContent = 'Não foi possível enviar agora. Tente novamente ou chame no WhatsApp.';
      formMsg.style.color = '#c0392b';
      formMsg.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Solicitar contato';
    }
  });

  // Mobile nav basic toggle style injection
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width:860px){
      .nav-links.mobile-open{
        display:flex; flex-direction:column; position:absolute; top:100%; left:0; right:0;
        background:var(--paper); padding:20px 28px; gap:16px; border-bottom:1px solid var(--line);
      }
      .nav-links.mobile-open a{font-size:1rem;}
    }
  `;
  document.head.appendChild(style);
