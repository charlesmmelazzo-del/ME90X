const STORAGE_KEY = "me90x:v1";
const CUSTOM_DATA_KEY = "me90x:workouts";
const LEGACY_STORAGE_KEY = "machinefit30:v1";
const LEGACY_CUSTOM_DATA_KEY = "machinefit30:workouts";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let state = loadState();
let workoutData = loadWorkoutData();
let selectedDay = new Date().getDay();
let timer = { seconds: 30 * 60, id: null };

const $ = (id) => document.getElementById(id);

function loadState() {
  const base = { completions: {}, loads: {}, notes: "", startDate: todayISO() };
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return { ...base, ...JSON.parse(saved) };
  } catch {
    return base;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadWorkoutData() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_DATA_KEY) || localStorage.getItem(LEGACY_CUSTOM_DATA_KEY)) || window.DEFAULT_WORKOUT_DATA;
  } catch {
    return window.DEFAULT_WORKOUT_DATA;
  }
}

function todayISO(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function currentWeekNumber() {
  const start = new Date(state.startDate + "T12:00:00");
  const now = new Date();
  const diff = now - start;
  return Math.max(1, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1);
}

function getPhase() {
  const week = currentWeekNumber();
  const cycleWeek = ((week - 1) % 4) + 1;
  if (cycleWeek === 1) return { name: `Week ${week}: Rebuild`, modifier: "Use conservative loads and learn the flow." };
  if (cycleWeek === 2) return { name: `Week ${week}: Add`, modifier: "Add 1 set to the first main lift when you feel good." };
  if (cycleWeek === 3) return { name: `Week ${week}: Push`, modifier: "Use the top end of rep ranges and progress eligible loads." };
  return { name: `Week ${week}: Deload`, modifier: "Cut one set from each exercise or use 85-90% of last week's load." };
}

function getWorkoutForDay(day) {
  const ids = workoutData.schedule[day] || [];
  const week = currentWeekNumber();
  const id = ids[(week - 1) % ids.length] || workoutData.workouts[0].id;
  return workoutData.workouts.find((workout) => workout.id === id) || workoutData.workouts[0];
}

function render() {
  renderDayPicker();
  renderToday();
  renderStats();
  renderLibrary();
  $("notes").value = state.notes || "";
  $("jsonBox").value = JSON.stringify(workoutData, null, 2);
}

function renderDayPicker() {
  $("dayPicker").innerHTML = DAY_NAMES.map((day, index) => `
    <button type="button" class="${index === selectedDay ? "active" : ""}" data-day="${index}">
      ${day.slice(0, 3)}
    </button>
  `).join("");
}

function renderToday() {
  const workout = getWorkoutForDay(selectedDay);
  const phase = getPhase();
  $("todayTitle").textContent = `${DAY_NAMES[selectedDay]}'s 30-minute workout`;
  $("phaseBadge").textContent = phase.name;
  $("focusBadge").textContent = titleCase(workout.focus);
  $("workoutName").textContent = workout.name;
  $("workoutIntent").textContent = `${workout.intent} ${workout.format}`;

  $("exerciseList").innerHTML = workout.exercises.map((item, index) => {
    const [name, sets, reps, effort, note] = item;
    const lastLoad = state.loads[name]?.last || "";
    return `
      <div class="exercise">
        <div class="exerciseMain">
          <span class="exerciseNumber">${index + 1}</span>
          <div>
            <h3>${name}</h3>
            <p>${sets} sets x ${reps} reps - ${effort}. ${note}</p>
          </div>
        </div>
        <label>
          <span>Load</span>
          <input inputmode="decimal" data-load="${name}" value="${lastLoad}" placeholder="pin/weight" />
        </label>
      </div>
    `;
  }).join("");

  $("progressionAdvice").textContent = buildProgressionAdvice(workout, phase);
  $("loadLog").innerHTML = workout.exercises.map(([name]) => {
    const entry = state.loads[name];
    const label = entry?.last ? `${entry.last} last used` : "No load logged yet";
    const streak = entry?.wins || 0;
    return `<div><strong>${name}</strong><span>${label}. Progress-ready exposures: ${streak}/2</span></div>`;
  }).join("");
}

function buildProgressionAdvice(workout, phase) {
  const cues = {
    strength: "When you can exceed the top rep target by 1-2 reps on two clean exposures, add 5-10% on leg press and 2-5% on upper-body cable or press work.",
    hypertrophy: "Stay mostly 1-3 reps shy of failure. Add reps first, then load. Chase tension and clean range, not exhaustion.",
    conditioning: "Keep the load repeatable. Progress by adding reps, reducing transitions, or moving one pin heavier only if breathing recovers between rounds.",
    power: "Power work should feel snappy. If rep speed slows, stop the set or lower the load.",
    mobility: "This is a recovery deposit. Keep it easy enough that tomorrow's main workout improves."
  };
  return `${phase.modifier} ${cues[workout.focus] || cues.strength}`;
}

function renderStats() {
  const completedDates = Object.keys(state.completions).sort();
  const weekStart = startOfWeek(new Date());
  const doneThisWeek = completedDates.filter((date) => new Date(date + "T12:00:00") >= weekStart).length;
  $("streakCount").textContent = calculateStreak();
  $("weekNumber").textContent = currentWeekNumber();
  $("completedThisWeek").textContent = doneThisWeek;
  $("totalDone").textContent = completedDates.length;
  $("weekSchedule").innerHTML = DAY_NAMES.map((day, index) => {
    const workout = getWorkoutForDay(index);
    const date = dateForDayThisWeek(index);
    const done = Boolean(state.completions[todayISO(date)]);
    return `<button type="button" data-schedule-day="${index}" class="${index === selectedDay ? "active" : ""} ${done ? "done" : ""}">
      <span>${day}</span><strong>${workout.name}</strong>
    </button>`;
  }).join("");
}

function renderLibrary() {
  const filter = $("libraryFilter")?.value || "all";
  const workouts = workoutData.workouts.filter((workout) => filter === "all" || workout.focus === filter);
  $("workoutLibrary").innerHTML = workouts.map((workout) => `
    <article class="workoutCard">
      <span>${titleCase(workout.focus)}</span>
      <h3>${workout.name}</h3>
      <p>${workout.intent}</p>
      <button type="button" data-preview="${workout.id}">Use today</button>
    </article>
  `).join("");
}

function startOfWeek(date) {
  const copy = new Date(date);
  copy.setHours(12, 0, 0, 0);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}

function dateForDayThisWeek(day) {
  const date = startOfWeek(new Date());
  date.setDate(date.getDate() + day);
  return date;
}

function calculateStreak() {
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  while (state.completions[todayISO(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function markComplete() {
  const date = dateForDayThisWeek(selectedDay);
  const iso = todayISO(date);
  const workout = getWorkoutForDay(selectedDay);
  state.completions[iso] = {
    workoutId: workout.id,
    workoutName: workout.name,
    readiness: $("readiness").value,
    completedAt: new Date().toISOString()
  };
  updateLoads(workout);
  saveState();
  render();
}

function updateLoads(workout) {
  const felt = $("readiness").value;
  document.querySelectorAll("[data-load]").forEach((input) => {
    const name = input.dataset.load;
    const value = input.value.trim();
    if (!value) return;
    const previous = state.loads[name] || { last: "", wins: 0, history: [] };
    const repsWereStrong = felt === "easy" || felt === "good";
    const wins = repsWereStrong && value === previous.last ? Math.min(2, (previous.wins || 0) + 1) : 1;
    state.loads[name] = {
      last: value,
      wins,
      history: [...(previous.history || []), { date: todayISO(), workoutId: workout.id, value, felt }].slice(-12)
    };
  });
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function tick() {
  timer.seconds -= 1;
  renderTimer();
  if (timer.seconds <= 0) {
    clearInterval(timer.id);
    timer.id = null;
  }
}

function renderTimer() {
  const minutes = Math.floor(timer.seconds / 60).toString().padStart(2, "0");
  const seconds = (timer.seconds % 60).toString().padStart(2, "0");
  $("timerDisplay").textContent = `${minutes}:${seconds}`;
}

document.addEventListener("click", (event) => {
  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    selectedDay = Number(dayButton.dataset.day);
    render();
  }
  const scheduleButton = event.target.closest("[data-schedule-day]");
  if (scheduleButton) {
    selectedDay = Number(scheduleButton.dataset.scheduleDay);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const previewButton = event.target.closest("[data-preview]");
  if (previewButton) {
    const workout = workoutData.workouts.find((item) => item.id === previewButton.dataset.preview);
    workoutData.schedule[selectedDay] = [workout.id, ...(workoutData.schedule[selectedDay] || []).filter((id) => id !== workout.id)];
    localStorage.setItem(CUSTOM_DATA_KEY, JSON.stringify(workoutData));
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

$("completeWorkout").addEventListener("click", markComplete);
$("libraryFilter").addEventListener("change", renderLibrary);
$("notes").addEventListener("input", (event) => {
  state.notes = event.target.value;
  saveState();
});
$("startTimer").addEventListener("click", () => {
  if (timer.id) return;
  timer.id = setInterval(tick, 1000);
});
$("resetTimer").addEventListener("click", () => {
  clearInterval(timer.id);
  timer = { seconds: 30 * 60, id: null };
  renderTimer();
});
$("exportData").addEventListener("click", () => {
  $("jsonBox").value = JSON.stringify(workoutData, null, 2);
  $("dataStatus").textContent = "Workout JSON exported below.";
});
$("importData").addEventListener("click", () => {
  try {
    const next = JSON.parse($("jsonBox").value);
    if (!Array.isArray(next.workouts) || !next.schedule) throw new Error("Missing workouts or schedule.");
    workoutData = next;
    localStorage.setItem(CUSTOM_DATA_KEY, JSON.stringify(workoutData));
    $("dataStatus").textContent = "Imported. Your workout rotation has been updated.";
    render();
  } catch (error) {
    $("dataStatus").textContent = `Import failed: ${error.message}`;
  }
});
$("copyPrompt").addEventListener("click", async () => {
  const prompt = `Create 7 new 30-minute machine-based workouts for this app. Use only these machines: ${workoutData.machines.join(", ")}. Return valid JSON matching this schema exactly: { "version": 1, "machines": string[], "schedule": { "0": string[], "1": string[], "2": string[], "3": string[], "4": string[], "5": string[], "6": string[] }, "workouts": [{ "id": "kebab-case", "name": "Workout name", "focus": "strength|conditioning|hypertrophy|power|mobility", "intent": "one sentence", "format": "one sentence timing structure", "exercises": [["exercise name","sets","reps","effort","form cue"]] }] }. Keep every workout 30 minutes, include progression-friendly rep ranges, and vary the training style.`;
  await navigator.clipboard.writeText(prompt);
  $("dataStatus").textContent = "Prompt copied.";
});

render();
