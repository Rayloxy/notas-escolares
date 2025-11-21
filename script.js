/* Sistema de Notas — Visualizador (carrega alunos.json se disponível)
   - Busca por nome e filtro por status
   - Cards e modal de detalhes apenas leitura
   - Fallback embutido se o fetch falhar (abre local sem servidor)
*/

const SUBJECTS = [
  "ARTE","BIOLOGIA","EDUCAÇÃO FÍSICA","FÍSICA","GEOGRAFIA",
  "HISTÓRIA","LÍNGUA INGLESA","LÍNGUA PORTUGUESA","MATEMÁTICA","QUÍMICA"
];

// fallback (caso fetch falhe)
const FALLBACK = [
  {
    nome: "Aluno Exemplo",
    imagem: "https://api.dicebear.com/9.x/pixel-art/svg?seed=Exemplo",
    notas: { "ARTE":7,"BIOLOGIA":7,"EDUCAÇÃO FÍSICA":8,"FÍSICA":6,"GEOGRAFIA":7,"HISTÓRIA":7,"LÍNGUA INGLESA":7,"LÍNGUA PORTUGUESA":7,"MATEMÁTICA":7,"QUÍMICA":6 }
  }
];

let ALUNOS = [];
let lista = [];

const cardsEl = document.getElementById('cards');
const campoBusca = document.getElementById('campo-busca');
const filtroStatus = document.getElementById('filtro-status');
const statsEl = document.getElementById('stats');

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

// --- tentar carregar alunos.json, se falhar usa fallback
fetch('alunos.json')
  .then(res => {
    if (!res.ok) throw new Error('fetch error');
    return res.json();
  })
  .then(data => {
    ALUNOS = data;
    lista = ALUNOS.slice();
    render();
  })
  .catch(err => {
    console.warn('Não foi possível carregar alunos.json — usando fallback.', err);
    ALUNOS = FALLBACK;
    lista = ALUNOS.slice();
    render();
  });

// util: média, status
function calcularMedia(notas){
  const vals = SUBJECTS.map(s => Number(notas[s] ?? 0));
  const soma = vals.reduce((a,b)=>a+b,0);
  const media = soma / SUBJECTS.length;
  return Number(media.toFixed(1));
}
function obterStatus(media){
  if (media >= 7) return {texto:'Aprovado', classe:'aprovado'};
  if (media >= 5) return {texto:'Recuperação', classe:'recuperacao'};
  return {texto:'Reprovado', classe:'reprovado'};
}

// render inicial
function render(){
  cardsEl.innerHTML = '';
  if (lista.length === 0){
    cardsEl.innerHTML = '<p style="color:var(--muted)">Nenhum aluno encontrado.</p>';
    renderStats();
    return;
  }

  lista.forEach((aluno, idx) => {
    const media = calcularMedia(aluno.notas);
    const status = obterStatus(media);

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-top">
        <div class="card-avatar"><img src="${aluno.imagem}" alt="${aluno.nome}"></div>
        <div style="flex:1">
          <h3>${aluno.nome}</h3>
          <div class="meta">Média geral: <strong>${media}</strong></div>
          <div class="meta" style="margin-top:6px"><span class="status ${status.classe}">${status.texto}</span></div>
        </div>
      </div>

      <ul class="notas">
        ${SUBJECTS.slice(0,4).map(s => `<li><span>${s}</span><strong>${aluno.notas[s] ?? 0}</strong></li>`).join('')}
        <li style="text-align:center;color:var(--muted);font-size:13px">Clique para ver todas as notas</li>
      </ul>
    `;

    // abrir modal ao clicar
    card.addEventListener('click', () => openModal(aluno));
    cardsEl.appendChild(card);
  });

  renderStats();
}

// estatísticas simples
function renderStats(){
  const total = ALUNOS.length;
  const medias = ALUNOS.map(a => calcularMedia(a.notas));
  const mediaGeral = (medias.reduce((a,b)=>a+b,0) / (medias.length || 1)).toFixed(1);
  const aprovados = medias.filter(m => m >= 7).length;
  statsEl.innerHTML = `
    <div class="stat"><h4>Total de alunos</h4><p>${total}</p></div>
    <div class="stat"><h4>Média geral</h4><p>${isNaN(mediaGeral) ? '—' : mediaGeral}</p></div>
    <div class="stat"><h4>Aprovados</h4><p>${aprovados}</p></div>
  `;
}

// filtro e busca
function aplicarFiltros(){
  const termo = campoBusca.value.trim().toLowerCase();
  const filtro = filtroStatus.value;
  lista = ALUNOS.filter(a => {
    const matchNome = a.nome.toLowerCase().includes(termo);
    if (!matchNome) return false;
    if (filtro === 'todos') return true;
    const media = calcularMedia(a.notas);
    const status = obterStatus(media);
    return status.classe === filtro;
  });
  render();
}

// modal
function openModal(aluno){
  const media = calcularMedia(aluno.notas);
  const status = obterStatus(media);
  modalBody.innerHTML = `
    <img src="${aluno.imagem}" alt="${aluno.nome}">
    <div>
      <h3 class="detail-title">${aluno.nome}</h3>
      <div class="detail-meta">Média: <strong>${media}</strong> &nbsp; <span class="status ${status.classe}">${status.texto}</span></div>
      <ul class="detail-list">
        ${SUBJECTS.map(s => `<li><span>${s}</span><strong>${aluno.notas[s] ?? 0}</strong></li>`).join('')}
      </ul>
    </div>
  `;
  modal.classList.remove('hidden');
  // foco para acessibilidade
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) closeBtn.focus();
}
function closeModal(){ modal.classList.add('hidden'); }

// eventos
campoBusca.addEventListener('input', aplicarFiltros);
filtroStatus.addEventListener('change', aplicarFiltros);
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
