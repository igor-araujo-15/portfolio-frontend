const API_URL = 'https://portfolio-backend-7xg1.onrender.com/api/entries';

const form = document.getElementById('entry-form');
const entryId = document.getElementById('entry-id');
const title = document.getElementById('title');
const description = document.getElementById('description');
const technology = document.getElementById('technology');
const repository = document.getElementById('repository');
const entriesList = document.getElementById('entries-list');
const message = document.getElementById('message');
const cancelEdit = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
const reloadBtn = document.getElementById('reload-btn');

function showMessage(text) {
  message.textContent = text;
}

function clearForm() {
  form.reset();
  entryId.value = '';
  formTitle.textContent = 'Novo Projeto';
  cancelEdit.classList.add('hidden');
}

async function loadEntries() {
  const response = await fetch(API_URL);
  const entries = await response.json();

  if (!entries.length) {
    entriesList.innerHTML = '<p>Nenhum projeto encontrado.</p>';
    return;
  }

  entriesList.innerHTML = entries.map(entry => `
    <div class="entry-item">
      <h3>${entry.titulo}</h3>
      <p><strong>Tecnologia:</strong> ${entry.tecnologia}</p>
      <p>${entry.descricao}</p>
      <p>
        <strong>Repositório:</strong>
        <a href="${entry.repositorio}" target="_blank">
          Ver Projeto
        </a>
      </p>

      <div class="entry-buttons">
        <button onclick="editEntry('${entry._id}')">Editar</button>
        <button onclick="deleteEntry('${entry._id}')">Excluir</button>
      </div>
    </div>
  `).join('');
}

async function saveEntry(data) {
  const id = entryId.value;

  const url = id
    ? `${API_URL}/${id}`
    : API_URL;

  const method = id
    ? 'PUT'
    : 'POST';

  await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

window.editEntry = async function (id) {

  const response = await fetch(`${API_URL}/${id}`);

  const entry = await response.json();

  entryId.value = entry._id;
  title.value = entry.titulo;
  description.value = entry.descricao;
  technology.value = entry.tecnologia;
  repository.value = entry.repositorio;

  formTitle.textContent = 'Editar Projeto';

  cancelEdit.classList.remove('hidden');

  showMessage('Editando projeto.');
};

window.deleteEntry = async function (id) {

  if (!confirm('Deseja excluir este projeto?')) return;

  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  showMessage('Projeto excluído.');

  loadEntries();
};

form.addEventListener('submit', async (e) => {

  e.preventDefault();

  const data = {
    titulo: title.value,
    descricao: description.value,
    tecnologia: technology.value,
    repositorio: repository.value
  };

  await saveEntry(data);

  showMessage(
    entryId.value
      ? 'Projeto atualizado.'
      : 'Projeto criado.'
  );

  clearForm();

  loadEntries();
});

cancelEdit.addEventListener('click', () => {

  clearForm();

  showMessage('Edição cancelada.');
});

reloadBtn.addEventListener('click', loadEntries);

if ('serviceWorker' in navigator) {

  window.addEventListener('load', async () => {

    try {

      await navigator.serviceWorker.register('./service-worker.js');

      console.log('Service Worker registrado com sucesso.');

    } catch (error) {

      console.log('Erro ao registrar Service Worker:', error);
    }
  });
}

clearForm();
loadEntries();