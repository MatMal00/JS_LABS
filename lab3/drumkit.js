const recordBtnOne = document.querySelector("#record-one");
const playRecordBtnOne = document.querySelector("#play-one");

const trackOne = { endTime: 0, sound: [] };

document.addEventListener("keypress", onKeyPress);

const KeyToSound = {
  a: document.querySelector("#s1"),
  s: document.querySelector("#s2"),
  d: document.querySelector("#s3"),
  f: document.querySelector("#s4"),
  g: document.querySelector("#s5"),
  h: document.querySelector("#s6"),
  j: document.querySelector("#s7"),
  k: document.querySelector("#s8"),
  l: document.querySelector("#s9"),
};

function onKeyPress(event) {
  const sound = KeyToSound[event.key];
  playSound(sound);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function recordTrack(trackArray) {
  console.log("is recording");
  const listener = document.addEventListener("keypress", (e) =>
    trackArray.sound.push({ key: e, timeStamp: Date.now() })
  );

  setTimeout(() => {
    document.removeEventListener("keypress", listener);
    trackArray.endTime = Date.now();
    console.log("record");
  }, 5000);
}

function playTrack(trackArray) {
  trackArray.sound.forEach((track) => {
    setTimeout(() => {
      onKeyPress(track.key);
    }, trackOne.endTime - track.timeStamp);
  });
}

recordBtnOne.addEventListener("click", () => recordTrack(trackOne));
playRecordBtnOne.addEventListener("click", () => playTrack(trackOne));
