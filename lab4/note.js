let notes = JSON.parse(localStorage.getItem('notes')) || [];

const addNote = () => {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const tag = document.getElementById('tag').value;
  const color = document.getElementById('color').value;

  notes.push({
    title,
    description,
    tag,
    date: Date.now(),
    color,
    id: Math.max(...notes.map(o => o.id + 1)),
    pinned: false,
  });

  localStorage.setItem('notes', JSON.stringify(notes));
  renderTree();
};

function removeNote(id) {
  notes = notes.filter(function (value) {
    return value.id !== id;
  });

  localStorage.setItem('notes', JSON.stringify(notes));
  renderTree();
}

function pinNote(id) {
  const note = notes.find(x => x.id === id);
  note.pinned = !note.pinned;

  localStorage.setItem('notes', JSON.stringify(notes));
  renderTree();
}

function searchNotes(event) {
  const searchQuery = event.target.value;
  if (searchQuery.trim()) renderTree();

  const lowerCaseQuery = searchQuery.toLowerCase();

  const filteredNotes = notes.filter(
    note =>
      note.title.toLowerCase().includes(lowerCaseQuery) ||
      note.description.toLowerCase().includes(lowerCaseQuery) ||
      note.tag.toLowerCase().includes(lowerCaseQuery)
  );

  renderTree(filteredNotes);
}

function renderTree(filteredNotes) {
  const notesToRender = filteredNotes ?? notes;

  const list = document.getElementById('list-handle');
  const pinnedList = document.getElementById('pinned-list-handle');
  list.innerHTML = '';
  pinnedList.innerHTML = '';

  notesToRender.forEach(note => {
    const noteHtml = renderNote(note);
    if (note.pinned) {
      pinnedList.innerHTML += noteHtml;
    } else {
      list.innerHTML += noteHtml;
    }
  });
}

function renderNote(note) {
  return `        
    <div class="note" style="background-color:${note.color}">
        <div>
            <h3>${note.title}</h3>
        </div>
        <p>${note.description}</p>
        <p>TAG: ${note.tag}</p>
        <p>${new Date(note.date).toISOString()}</p>
        <div>
            ${note.pinned}
            <input type="button" value="X" onclick="removeNote(${note.id})">
            <input type="button" value="Pin" onclick="pinNote(${note.id})">
        </div>
    </div>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  renderTree();
});
