let notes = JSON.parse(localStorage.getItem('notes')) || [];

const addNote = () => {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const tag = document.getElementById('tag').value;
  const color = document.getElementById('color').value;
  const reminderCheckbox = document.getElementById('reminderCheckbox').checked;

  const dateValue = document.getElementById('reminderDate').value;
  const timeValue = document.getElementById('reminderTime').value;
  let reminderDate = null;

  if (dateValue && timeValue && reminderCheckbox) reminderDate = new Date(dateValue + 'T' + timeValue);

  notes.push({
    title,
    description,
    tag,
    date: Date.now(),
    color,
    id: Math.max(...notes.map(o => o.id + 1)),
    pinned: false,
    done: false,
    reminder: reminderCheckbox,
    reminderDate,
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

function markAsDone(id) {
  const note = notes.find(x => x.id === id);
  note.done = !note.done;

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

function toggleReminderInputs() {
  const reminderCheckbox = document.getElementById('reminderCheckbox');
  const reminderInputs = document.getElementById('reminderInputs');

  reminderInputs.style.display = reminderCheckbox.checked ? 'block' : 'none';
}

function renderTree(filteredNotes) {
  const notesToRender = filteredNotes ?? notes;

  const list = document.getElementById('list-handle');
  const pinnedList = document.getElementById('pinned-list-handle');
  const doneList = document.getElementById('done-list-handle');

  list.innerHTML = '';
  pinnedList.innerHTML = '';
  doneList.innerHTML = '';

  notesToRender.forEach(note => {
    const noteHtml = renderNote(note);
    if (note.pinned) {
      pinnedList.innerHTML += noteHtml;
    } else if (note.done) {
      doneList.innerHTML += noteHtml;
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
            <div>
                <input type="button" value="X" onclick="removeNote(${note.id})">
            </div>
            <div>
                ${note.pinned}
                <input type="button" value="Pin" onclick="pinNote(${note.id})">
            </div>       
            <div>
                ${note.done}
                <input type="button" value="Done" onclick="markAsDone(${note.id})">
            </div>
        </div>
    </div>`;
}

function checkForReminder() {
  const now = new Date();

  notes.forEach(note => {
    if (note.reminder && note.reminderDate) {
      const reminderDate = new Date(note.reminderDate);

      if (
        now.toDateString() >= reminderDate.toDateString() &&
        now.getHours() >= reminderDate.getHours() &&
        now.getMinutes() >= reminderDate.getMinutes()
      ) {
        alert(`Reminder for note: ${note.title}`);
        note.reminder = false;
      }
    }
  });
  localStorage.setItem('notes', JSON.stringify(notes));
}

document.addEventListener('DOMContentLoaded', async () => {
  renderTree();
  checkForReminder();
  setInterval(checkForReminder, 10000);
});
