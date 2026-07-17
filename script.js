// ---------- Data ----------

const readingPassagesShort = [
  "The train was late again, so Maya decided to walk instead. The morning air felt sharp, but she didn't mind. Sometimes a delay is just an excuse to slow down.",
  "My neighbor grows tomatoes on his balcony, even in winter. He says the trick is patience, not sunlight. I still don't believe him.",
  "The meeting ran twenty minutes over, and nobody dared to leave first. By the end, half the room had forgotten why they were there.",
  "She opened the old notebook and found a list of goals from ten years ago. Most of them were still unfinished, and that felt strangely comforting.",
  "The café on the corner changed owners last month. The coffee got worse, but the playlist got better, so people still come back.",
  "He learned to fix bicycles by watching videos late at night. Now half the street brings him their broken wheels.",
  "The internet went down for three hours, and the office suddenly felt very quiet. A few people admitted they preferred it that way.",
  "Every Sunday, the same old man feeds the pigeons in the square, rain or shine. Nobody knows his name, but everyone recognizes his coat.",
  "The new intern asked so many questions that the whole team learned something by the end of the week.",
  "A storm knocked out the power grid overnight. By morning, the whole town smelled like coffee brewed the old way, over a fire.",
  "She kept rewriting the first sentence of her essay, convinced that if she got it right, the rest would follow easily.",
  "The library extended its hours during exam season, and by midnight the reading room was still full of students and empty cups."
];

const readingPassagesArticulation = [
  "Red lorries, yellow lorries, and blue lorries lined up along the road, waiting for the bridge to reopen.",
  "Six thick thistles stuck in a thick sack sat outside the shed until Thursday.",
  "The big black bug bit the big black bear, and the big black bear bled black blood.",
  "Peter Piper picked a peck of pickled peppers, but nobody could agree on how many pecks he actually picked.",
  "A proper copper coffee pot sat quietly on the counter, cooling since noon.",
  "Truly rural, the three trees swayed together in the cold, clear morning air.",
  "The sixth sick sheikh's sixth sheep is sick, and the vet is stuck in traffic.",
  "Which wristwatches are Swiss wristwatches? Only the shopkeeper seemed to know for sure.",
  "The chief of police pieced together the clues slowly, sipping cold coffee the whole time.",
  "Fresh fried fish, freshly served, filled the small kitchen with a sharp, salty smell."
];

const randomTopics1min = [
  "Your ideal weekend, from morning to night",
  "A skill you wish you had learned earlier",
  "The last thing that made you laugh",
  "A city you'd like to visit and why",
  "Something you own that you'd never sell",
  "A habit you're trying to build this year",
  "The best advice someone ever gave you",
  "A job you think would be interesting to try",
  "Your morning routine, step by step",
  "A movie or show you could rewatch endlessly",
  "How you would spend an unexpected day off",
  "Something that surprised you recently",
  "A rule you think schools should change",
  "Your favorite way to relax after a long day",
  "A piece of technology you couldn't live without",
  "Something you're curious about but haven't researched yet",
  "A decision you're glad you made",
  "The kind of music you listen to when you study",
  "A tradition from your country you'd explain to a foreigner",
  "What a perfect study session looks like for you",
  "A small thing that instantly improves your mood",
  "Something you'd tell your younger self",
  "A skill that looks easy but is actually hard",
  "The last book, article or video that taught you something",
  "How you imagine your life in five years",
  "A place where you do your best thinking",
  "Something you changed your mind about recently",
  "The most useful app on your phone",
  "A challenge you're currently facing",
  "Something you do differently from most people you know"
];

const personalTopics2min = [
  "Describe your studies right now: what you're learning and why you chose it",
  "Explain what you're looking for in your future alternance or job",
  "Talk about a project you're proud of and what you learned from it",
  "Describe your ideal work environment and team",
  "Explain why you started learning English and what progress feels like so far",
  "Talk about a difficulty you've faced this year and how you handled it",
  "Describe someone who influenced how you think or work",
  "Explain what a normal week looks like for you these days",
  "Talk about a goal you're working towards over the next six months",
  "Describe a moment when you felt genuinely confident",
  "Explain what first got you interested in your field of study",
  "Talk about how you balance studying, work, and free time",
  "Describe the city or region where you live to someone who's never been",
  "Explain a mistake you made and what it taught you",
  "Talk about what motivates you on days when you don't feel like working"
];

// ---------- Helpers ----------

function pickRandom(arr, excludeText){
  if(arr.length === 1) return arr[0];
  let choice;
  do{
    choice = arr[Math.floor(Math.random() * arr.length)];
  }while(choice === excludeText);
  return choice;
}

function formatTime(totalSeconds){
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function todayKey(){
  return new Date().toISOString().slice(0,10);
}

// ---------- Accordion ----------

document.querySelectorAll('.station-head').forEach(head => {
  head.addEventListener('click', () => {
    const station = head.closest('.station');
    const isOpen = station.classList.contains('open');
    station.classList.toggle('open', !isOpen);
    head.setAttribute('aria-expanded', String(!isOpen));
  });
});

// ---------- Shuffle buttons (topics & passages) ----------

const contentBanks = {
  'reading-passage-2': readingPassagesArticulation,
  'reading-passage-5': readingPassagesShort,
  'topic-4': randomTopics1min,
  'topic-6': personalTopics2min
};

function fillTarget(targetId){
  const el = document.getElementById(targetId);
  if(!el) return;
  const bank = contentBanks[targetId];
  el.textContent = pickRandom(bank, el.textContent);
}

document.querySelectorAll('.btn-shuffle').forEach(btn => {
  const targetId = btn.dataset.target;
  fillTarget(targetId); // fill on load
  btn.addEventListener('click', () => {
    fillTarget(targetId);
    if(targetId === 'topic-4'){
      const counterEl = document.getElementById('round-count-4');
      counterEl.textContent = String(Number(counterEl.textContent) + 1);
    }
  });
});

// ---------- Timers ----------

document.querySelectorAll('.timer').forEach(timerEl => {
  const defaultSeconds = Number(timerEl.dataset.default);
  let remaining = defaultSeconds;
  let intervalId = null;
  const display = timerEl.querySelector('.timer-display');
  const startBtn = timerEl.querySelector('.btn-start');
  const resetBtn = timerEl.querySelector('.btn-reset');

  function render(){
    display.textContent = formatTime(remaining);
  }

  function tick(){
    remaining -= 1;
    if(remaining <= 0){
      remaining = 0;
      render();
      stop();
      display.textContent = "00:00";
      return;
    }
    render();
  }

  function start(){
    if(intervalId) return;
    timerEl.classList.add('running');
    startBtn.textContent = "Pause";
    intervalId = setInterval(tick, 1000);
  }

  function stop(){
    clearInterval(intervalId);
    intervalId = null;
    timerEl.classList.remove('running');
    startBtn.textContent = "Démarrer";
  }

  startBtn.addEventListener('click', () => {
    if(intervalId){ stop(); } else { start(); }
  });

  resetBtn.addEventListener('click', () => {
    stop();
    remaining = defaultSeconds;
    render();
    if(timerEl.closest('[data-step="4"]')){
      document.getElementById('round-count-4').textContent = "0";
    }
  });

  render();
});

// ---------- Streak / progress tracking ----------

const STORAGE_KEY = 'speak-drill-progress';

function loadProgress(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { date: null, steps: [], streak: 0, lastCompleteDate: null };
  }catch(e){
    return { date: null, steps: [], streak: 0, lastCompleteDate: null };
  }
}

function saveProgress(progress){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

let progress = loadProgress();
if(progress.date !== todayKey()){
  progress.date = todayKey();
  progress.steps = [];
  saveProgress(progress);
}

function renderStreak(){
  document.getElementById('streak-num').textContent = String(progress.streak || 0);
}

function renderDoneButtons(){
  document.querySelectorAll('.station').forEach(station => {
    const step = station.dataset.step;
    const btn = station.querySelector('.btn-done');
    const isDone = progress.steps.includes(step);
    btn.classList.toggle('done', isDone);
    btn.textContent = isDone ? "Fait ✓ aujourd'hui" : "Marquer comme fait aujourd'hui";
  });
}

function yesterdayKey(){
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0,10);
}

document.querySelectorAll('.btn-done').forEach(btn => {
  btn.addEventListener('click', () => {
    const step = btn.closest('.station').dataset.step;
    const idx = progress.steps.indexOf(step);
    if(idx === -1){
      progress.steps.push(step);
    }else{
      progress.steps.splice(idx, 1);
    }

    if(progress.steps.length === 6 && progress.lastCompleteDate !== todayKey()){
      progress.streak = progress.lastCompleteDate === yesterdayKey() ? (progress.streak || 0) + 1 : 1;
      progress.lastCompleteDate = todayKey();
    }
    if(progress.steps.length < 6 && progress.lastCompleteDate === todayKey()){
      // undone after completing today: roll the streak back by one
      progress.streak = Math.max(0, (progress.streak || 1) - 1);
      progress.lastCompleteDate = null;
    }

    saveProgress(progress);
    renderDoneButtons();
    renderStreak();
  });
});

document.getElementById('reset-day').addEventListener('click', () => {
  progress.steps = [];
  saveProgress(progress);
  renderDoneButtons();
});

renderStreak();
renderDoneButtons();
