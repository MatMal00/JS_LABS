const recordBtns = document.querySelectorAll('.record');
const playRecordBtns = document.querySelectorAll('.play');
const playAll = document.querySelector('#play-all');
const metofromInput = document.querySelector('#metodrom');
const metodromBtn = document.querySelector('#metodromBtn');

const trackArray = [
  { endTime: 0, sound: [] },
  { endTime: 0, sound: [] },
  { endTime: 0, sound: [] },
  { endTime: 0, sound: [] },
  { endTime: 0, sound: [] },
];

let interval;
let noOfBeats = null;
let isMetodromOn = false;

document.addEventListener('keypress', onKeyPress);

const KeyToSound = {
  a: document.querySelector('#s1'),
  s: document.querySelector('#s2'),
  d: document.querySelector('#s3'),
  f: document.querySelector('#s4'),
  g: document.querySelector('#s5'),
  h: document.querySelector('#s6'),
  j: document.querySelector('#s7'),
  k: document.querySelector('#s8'),
  l: document.querySelector('#s9'),
};

function onKeyPress(event) {
  const sound = KeyToSound[event.key];
  playSound(sound);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function recordTrack(track) {
  console.log('is recording');
  const listener = document.addEventListener('keypress', e => track.sound.push({ key: e, timeStamp: Date.now() }));

  setTimeout(() => {
    document.removeEventListener('keypress', listener);
    track.endTime = Date.now();
    console.log('record');
  }, 5000);
}

function playTrack(track) {
  console.log('playing');
  track.sound.forEach(sound => {
    setTimeout(() => {
      onKeyPress(sound.key);
    }, track.endTime - sound.timeStamp);
  });
}

function metodromPlayPause() {
  if (isMetodromOn) {
    clearInterval(interval);

    isMetodromOn = false;
  } else if (noOfBeats) {
    isMetodromOn = true;

    interval = setInterval(() => {
      playSound(KeyToSound['f']);
    }, 60000 / noOfBeats);
  }
}

recordBtns.forEach((btn, index) => btn.addEventListener('click', () => recordTrack(trackArray[index])));
playRecordBtns.forEach((btn, index) => btn.addEventListener('click', () => playTrack(trackArray[index])));
playAll.addEventListener('click', () => trackArray.forEach(track => playTrack(track)));
metofromInput.addEventListener('input', e => {
  console.log(e.target.value);
  noOfBeats = e.target.value;
});
metodromBtn.addEventListener('click', () => metodromPlayPause());
