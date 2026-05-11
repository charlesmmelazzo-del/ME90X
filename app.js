const STORAGE_KEY = "me90x:v2";
const LEGACY_STORAGE_KEYS = ["me90x:v1", "machinefit30:v1"];
const CUSTOM_DATA_KEY = "me90x:workouts";
const LEGACY_CUSTOM_DATA_KEY = "machinefit30:workouts";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let state = loadState();
let workoutData = loadWorkoutData();
let selectedDay = new Date().getDay();

const $ = (id) => document.getElementById(id);

const DEFAULT_LOADS = [
  ["leg press calf", "Start around 60-100 lb. It should feel smooth, not shaky."],
  ["leg press", "Start around 80-140 lb. Go lighter if your knees feel unsure."],
  ["multi-press", "Start around 40-70 lb. You should be able to stop the weight at any point."],
  ["chest press", "Start around 40-70 lb. Keep two good reps in the tank."],
  ["row station", "Start around 40-70 lb. Pick a weight you can pause without leaning back."],
  ["row", "Start around 25-45 lb per cable side, or one easy pin if unsure."],
  ["face pull", "Start very light: 10-25 lb. This is shoulder care, not ego work."],
  ["lateral raise", "Start very light: 5-15 lb. If you shrug, it is too heavy."],
  ["curl", "Start around 15-30 lb. Keep your elbows still."],
  ["triceps", "Start around 20-40 lb. Keep shoulders relaxed."],
  ["pallof", "Start around 10-25 lb. You should resist twisting without wobbling."],
  ["chop", "Start around 15-30 lb. Smooth beats heavy."],
  ["crunch", "Start around 25-45 lb. Curl down, do not yank."],
  ["romanian deadlift", "Start around 30-60 lb. Feel hamstrings, not low back."],
  ["rdl", "Start around 30-60 lb. Feel hamstrings, not low back."],
  ["pull-through", "Start around 30-60 lb. Hips move, back stays quiet."],
  ["lunge", "Start bodyweight or 10-25 lb. Balance comes first."],
  ["split squat", "Start bodyweight or 10-25 lb. Balance comes first."],
  ["squat", "Start light enough that every rep looks the same."],
  ["press", "Start around 20-40 lb per cable side. Own the motion before adding weight."],
];

const GUIDE_LIBRARY = [
  {
    match: ["leg press"],
    type: "leg",
    setup: "Sit back against the pad. Put both feet flat on the platform about shoulder-width apart.",
    action: "Push the platform away, then lower it slowly until your knees bend comfortably. Stop before your hips curl off the pad.",
    avoid: "Do not lock your knees hard at the top. Do not let your knees cave inward."
  },
  {
    match: ["calf"],
    type: "leg",
    setup: "Keep the balls of your feet on the platform and let your heels hang slightly lower.",
    action: "Press through your toes, pause at the top, then lower slowly for a stretch.",
    avoid: "Do not bounce. Small fast reps do not count here."
  },
  {
    match: ["chest press", "multi-press", "speed press"],
    type: "press",
    setup: "Sit tall. Handles should start near the middle of your chest. Keep your shoulder blades gently pulled back.",
    action: "Press the handles away from you, then bring them back slowly. Think smooth out, controlled back.",
    avoid: "Do not shrug your shoulders or bounce the handles off the machine."
  },
  {
    match: ["row"],
    type: "row",
    setup: "Sit tall or stand tall. Start with arms long and shoulders away from your ears.",
    action: "Pull your elbows back toward your ribs. Pause for one second, then return slowly.",
    avoid: "Do not lean way back to finish the rep. Your back should not do a big swing."
  },
  {
    match: ["face pull"],
    type: "face",
    setup: "Set the cable around face height. Hold the rope or handles with thumbs pointing back.",
    action: "Pull toward your eyebrows and let your elbows spread out. Finish with hands beside your face.",
    avoid: "Do not turn it into a row. Keep it light and clean."
  },
  {
    match: ["pallof", "anti-rotation"],
    type: "core",
    setup: "Stand sideways to the cable. Hold the handle at your chest with both hands.",
    action: "Press your hands straight out, pause, then bring them back. Your job is to not twist.",
    avoid: "Do not let the cable rotate your shoulders or hips."
  },
  {
    match: ["triceps", "pressdown"],
    type: "pressdown",
    setup: "Stand tall facing the cable. Elbows stay tucked near your sides.",
    action: "Push the handle down until your arms are straight, then come back slowly.",
    avoid: "Do not swing your torso or let your elbows drift forward."
  },
  {
    match: ["curl"],
    type: "curl",
    setup: "Stand tall facing the cable. Keep elbows close to your sides.",
    action: "Curl the handle up, squeeze briefly, then lower with control.",
    avoid: "Do not rock your body to lift the weight."
  },
  {
    match: ["romanian deadlift", "rdl", "hinge", "pull-through"],
    type: "hinge",
    setup: "Stand tall with a soft bend in your knees. Brace like someone is about to poke your stomach.",
    action: "Push your hips back, feel the stretch in your hamstrings, then stand tall again.",
    avoid: "Do not round your low back. If you feel it mostly in your back, go lighter."
  },
  {
    match: ["lunge", "split squat"],
    type: "lunge",
    setup: "Stand tall and hold the cable lightly for balance if needed.",
    action: "Step or lower one leg back, bend both knees, then push through the front foot to stand.",
    avoid: "Do not rush. Keep your front knee pointing the same direction as your toes."
  },
  {
    match: ["wood chop", "chop", "rotational"],
    type: "rotate",
    setup: "Stand sideways to the cable with feet planted and hands holding the handle together.",
    action: "Turn your chest and hips together like one unit. Move smoothly across your body.",
    avoid: "Do not twist only through your low back."
  },
  {
    match: ["lateral raise"],
    type: "raise",
    setup: "Stand sideways to the cable with the handle in the outside hand.",
    action: "Lift your arm out to the side to about shoulder height, then lower slowly.",
    avoid: "Do not shrug. If your neck works harder than your shoulder, lower the weight."
  },
  {
    match: ["crunch", "dead bug", "march", "hold"],
    type: "core",
    setup: "Get set so your ribs are stacked over your hips. Keep your breathing calm.",
    action: "Move slowly and keep your middle tight, like you are stopping your body from being pulled around.",
    avoid: "Do not hold your breath or arch your low back."
  }
];

function loadState() {
  const base = { completions: {}, setChecks: {}, loads: {}, notes: "", startDate: todayISO() };
  const saved = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS].map((key) => localStorage.getItem(key)).find(Boolean);
  if (!saved) return base;
  try {
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
  const diff = new Date() - start;
  return Math.max(1, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1);
}

function getPhase() {
  const week = currentWeekNumber();
  const cycleWeek = ((week - 1) % 4) + 1;
  if (cycleWeek === 1) return { name: `Week ${week}: Rebuild`, modifier: "Start lighter than you think. Learn the movements and leave each set feeling clean." };
  if (cycleWeek === 2) return { name: `Week ${week}: Add`, modifier: "If last week felt good, add a little weight to exercises that were smooth." };
  if (cycleWeek === 3) return { name: `Week ${week}: Push`, modifier: "Use the top of the rep range. Move up only when your form still looks good." };
  return { name: `Week ${week}: Back off`, modifier: "Use lighter weights this week. Keep the habit, save your joints." };
}

function getWorkoutForDay(day) {
  const ids = workoutData.schedule[day] || [];
  const id = ids[(currentWeekNumber() - 1) % ids.length] || workoutData.workouts[0].id;
  return workoutData.workouts.find((workout) => workout.id === id) || workoutData.workouts[0];
}

function render() {
  renderToday();
  renderStats();
  renderLibrary();
  if ($("notes")) $("notes").value = state.notes || "";
  if ($("jsonBox")) $("jsonBox").value = JSON.stringify(workoutData, null, 2);
}

function renderToday() {
  const workout = getWorkoutForDay(selectedDay);
  const phase = getPhase();
  $("todayTitle").textContent = `${DAY_NAMES[selectedDay]} workout`;
  $("phaseBadge").textContent = phase.name;
  $("focusBadge").textContent = focusLabel(workout.focus);
  $("workoutName").textContent = workout.name;
  $("workoutIntent").textContent = plainWorkoutIntro(workout);

  const exercises = normalizeExercises(workout);
  $("exerciseList").innerHTML = exercises.map((exercise, index) => renderExercise(exercise, index, workout)).join("");
  renderWorkoutProgress(workout, exercises);

  $("progressionAdvice").textContent = buildProgressionAdvice(workout, phase);
  $("loadLog").innerHTML = exercises.map((exercise) => {
    const entry = state.loads[exercise.name];
    const label = entry?.last ? `${entry.last} last used` : suggestedLoad(exercise.name);
    return `<div><strong>${plainName(exercise.name)}</strong><span>${label}. Good sessions before increase: ${entry?.wins || 0}/2</span></div>`;
  }).join("");
}

function renderExercise(exercise, index, workout) {
  const guide = getExerciseGuide(exercise.name);
  const totalSets = setCount(exercise.sets);
  const completeSets = countCompleteSets(workout, exercise);
  const loadEntry = state.loads[exercise.name];
  const suggested = suggestedLoad(exercise.name);
  const actual = loadEntry?.last || "";
  const setButtons = Array.from({ length: totalSets }, (_, setIndex) => {
    const checked = isSetDone(workout, exercise, setIndex);
    return `<button type="button" class="setButton ${checked ? "done" : ""}" data-set="${setIndex}" data-exercise="${escapeAttr(exercise.name)}">
      Set ${setIndex + 1}
    </button>`;
  }).join("");

  return `
    <article class="exercise">
      <div class="exerciseHeader">
        <span class="exerciseNumber">${index + 1}</span>
        <div>
          <h3>${plainName(exercise.name)}</h3>
          <p>${totalSets} sets. Do ${exercise.reps} reps each set. ${plainEffort(exercise.effort)}</p>
        </div>
      </div>
      <div class="exerciseBody">
        ${movementGuide(guide.type)}
        <div class="instructionGrid">
          <div><strong>Set up</strong><p>${guide.setup}</p></div>
          <div><strong>Do this</strong><p>${guide.action}</p></div>
          <div><strong>Watch out</strong><p>${guide.avoid}</p></div>
        </div>
      </div>
      <div class="loadPanel">
        <div>
          <strong>Suggested load</strong>
          <p>${loadSuggestionText(exercise.name, suggested, loadEntry)}</p>
        </div>
        <label>
          <span>Actual load used</span>
          <input inputmode="decimal" data-load="${escapeAttr(exercise.name)}" value="${escapeAttr(actual)}" placeholder="Example: 60 lb or pin 6" />
        </label>
      </div>
      <div class="setTracker">
        <div><strong>${completeSets}/${totalSets} sets done</strong><span>${exercise.reps} reps per set</span></div>
        <div class="setButtons">${setButtons}</div>
      </div>
    </article>
  `;
}

function normalizeExercises(workout) {
  return workout.exercises.map((item) => {
    if (Array.isArray(item)) {
      const [name, sets, reps, effort, note] = item;
      return { name, sets, reps, effort, note };
    }
    return item;
  });
}

function plainWorkoutIntro(workout) {
  return `${workout.intent} Aim for about 30 minutes. Move steadily, rest when your breathing or form needs it.`;
}

function plainName(name) {
  return name
    .replace(/^FTS\s+/i, "Cable ")
    .replace(/\bRDL\b/g, "Romanian deadlift")
    .replace(/Pallof/i, "anti-twist")
    .replace(/fast-but-clean/i, "controlled")
    .replace(/rhythm reps/i, "steady reps");
}

function plainEffort(effort = "") {
  const lower = String(effort).toLowerCase();
  if (lower.includes("rir")) return "Stop while you still have 1-2 good reps left.";
  if (lower.includes("fast") || lower.includes("crisp")) return "Move with snap, but only if you can stay in control.";
  if (lower.includes("easy")) return "This should feel easy and smooth.";
  if (lower.includes("steady") || lower.includes("strong")) return "Keep the motion steady and controlled.";
  return "Choose a weight that lets every rep look the same.";
}

function getExerciseGuide(name) {
  const lower = name.toLowerCase();
  return GUIDE_LIBRARY.find((guide) => guide.match.some((term) => lower.includes(term))) || {
    type: "cable",
    setup: "Stand tall, brace your middle, and choose a light starting weight.",
    action: "Move slowly through the full motion. Control the weight on the way back.",
    avoid: "Do not chase heavy weight if your body starts twisting, shrugging, or swinging."
  };
}

function suggestedLoad(name) {
  const entry = state.loads[name];
  if (entry?.last) return entry.last;
  const lower = name.toLowerCase();
  return DEFAULT_LOADS.find(([term]) => lower.includes(term))?.[1] || "Start light enough that the last rep still looks clean.";
}

function loadSuggestionText(name, suggestion, entry) {
  if (!entry?.last) return suggestion;
  if ((entry.wins || 0) >= 2) return `Last time: ${entry.last}. You have had two good sessions. Try one small jump today.`;
  return `Last time: ${entry.last}. Repeat that load until you get two good sessions.`;
}

function setCount(sets) {
  const count = Number.parseInt(String(sets), 10);
  return Number.isFinite(count) ? count : 2;
}

function workoutDateISO() {
  return todayISO(dateForDayThisWeek(selectedDay));
}

function setKey(workout, exercise, setIndex) {
  return `${workoutDateISO()}::${workout.id}::${slug(exercise.name)}::${setIndex}`;
}

function isSetDone(workout, exercise, setIndex) {
  return Boolean(state.setChecks[setKey(workout, exercise, setIndex)]);
}

function countCompleteSets(workout, exercise) {
  return Array.from({ length: setCount(exercise.sets) }).filter((_, index) => isSetDone(workout, exercise, index)).length;
}

function renderWorkoutProgress(workout, exercises) {
  const total = exercises.reduce((sum, exercise) => sum + setCount(exercise.sets), 0);
  const done = exercises.reduce((sum, exercise) => sum + countCompleteSets(workout, exercise), 0);
  $("setProgressText").textContent = `${done} of ${total} sets done`;
  $("setProgressBar").style.width = `${total ? (done / total) * 100 : 0}%`;
}

function buildProgressionAdvice(workout, phase) {
  const cues = {
    strength: "If an exercise feels good for two workouts in a row, go up one small step next time. For leg press that might be 10-20 lb. For cables or upper-body machines, 5-10 lb is plenty.",
    hypertrophy: "Use the same load until you can finish every set with clean reps. Then move up one small step.",
    conditioning: "Keep the load easy enough that you can keep moving. Add weight only when you are not gasping between sets.",
    power: "Only go heavier if the movement still feels quick. Slow reps mean the weight is too heavy today.",
    mobility: "Keep it light. This day is about feeling better when you leave."
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
      <span>${day.slice(0, 3)}</span><strong>${workout.name}</strong><small>${done ? "Done" : "Start"}</small>
    </button>`;
  }).join("");
  requestAnimationFrame(() => {
    const activeDay = document.querySelector("[data-schedule-day].active");
    activeDay?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });
}

function renderLibrary() {
  if (!$("workoutLibrary")) return;
  const filter = $("libraryFilter")?.value || "all";
  const workouts = workoutData.workouts.filter((workout) => filter === "all" || workout.focus === filter);
  $("workoutLibrary").innerHTML = workouts.map((workout) => `
    <article class="workoutCard">
      <span>${focusLabel(workout.focus)}</span>
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
  const date = workoutDateISO();
  const workout = getWorkoutForDay(selectedDay);
  const exercises = normalizeExercises(workout);
  exercises.forEach((exercise) => {
    Array.from({ length: setCount(exercise.sets) }).forEach((_, index) => {
      state.setChecks[setKey(workout, exercise, index)] = true;
    });
  });
  state.completions[date] = {
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
    const goodSession = felt === "easy" || felt === "good";
    const wins = goodSession && value === previous.last ? Math.min(2, (previous.wins || 0) + 1) : 1;
    state.loads[name] = {
      last: value,
      wins,
      history: [...(previous.history || []), { date: todayISO(), workoutId: workout.id, value, felt }].slice(-12)
    };
  });
}

function toggleSet(button) {
  const workout = getWorkoutForDay(selectedDay);
  const exercises = normalizeExercises(workout);
  const exercise = exercises.find((item) => item.name === button.dataset.exercise);
  if (!exercise) return;
  const key = setKey(workout, exercise, Number(button.dataset.set));
  state.setChecks[key] = !state.setChecks[key];
  saveState();
  renderToday();
}

function focusLabel(value) {
  const labels = { strength: "Strength", conditioning: "Sweat", hypertrophy: "Muscle", power: "Power", mobility: "Recovery" };
  return labels[value] || titleCase(value);
}

function titleCase(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function escapeAttr(value = "") {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function movementGuide(type) {
  const labels = {
    press: ["Sit tall", "Press forward"],
    row: ["Arms long", "Pull elbows back"],
    leg: ["Feet flat", "Push platform"],
    face: ["Cable high", "Pull to face"],
    core: ["Brace", "Do not twist"],
    pressdown: ["Elbows pinned", "Push down"],
    curl: ["Elbows still", "Curl up"],
    hinge: ["Hips back", "Stand tall"],
    lunge: ["Step back", "Drive up"],
    rotate: ["Turn together", "Control back"],
    raise: ["Arm out", "Lower slowly"],
    cable: ["Stand tall", "Control cable"]
  };
  const [start, finish] = labels[type] || labels.cable;
  return `
    <div class="movementGuide" aria-hidden="true">
      <svg viewBox="0 0 220 132" role="img">
        <line x1="22" y1="108" x2="198" y2="108"></line>
        <circle cx="58" cy="38" r="14"></circle>
        <line x1="58" y1="52" x2="58" y2="86"></line>
        <line x1="58" y1="86" x2="40" y2="108"></line>
        <line x1="58" y1="86" x2="80" y2="108"></line>
        <path d="${guidePath(type)}"></path>
        <circle class="handle" cx="${handlePoint(type)[0]}" cy="${handlePoint(type)[1]}" r="7"></circle>
        <path class="arrow" d="${arrowPath(type)}"></path>
      </svg>
      <div><span>${start}</span><span>${finish}</span></div>
    </div>
  `;
}

function guidePath(type) {
  if (type === "leg") return "M88 86 L150 62 L190 62";
  if (type === "row") return "M58 62 C90 62 112 62 142 62";
  if (type === "hinge") return "M58 70 C82 88 112 94 144 94";
  if (type === "lunge") return "M58 86 C88 82 112 92 142 108";
  if (type === "rotate") return "M58 66 C92 42 128 42 160 66";
  if (type === "raise") return "M58 62 C82 42 104 34 132 30";
  if (type === "pressdown") return "M58 58 C82 66 104 78 130 96";
  if (type === "curl") return "M58 88 C78 72 96 58 116 44";
  if (type === "face") return "M58 46 C84 42 106 40 132 38";
  if (type === "core") return "M58 64 L138 64";
  return "M58 66 C88 58 116 58 144 66";
}

function arrowPath(type) {
  if (type === "leg") return "M146 62 L176 62 M166 54 L176 62 L166 70";
  if (type === "row") return "M142 62 L102 62 M112 54 L102 62 L112 70";
  if (type === "pressdown") return "M124 76 L132 98 M122 91 L132 98 L136 85";
  if (type === "curl") return "M102 58 L118 42 M105 42 L118 42 L116 56";
  if (type === "hinge") return "M80 88 L110 94 M100 86 L110 94 L98 100";
  if (type === "rotate") return "M118 42 L152 58 M144 46 L152 58 L138 60";
  return "M104 58 L136 58 M126 50 L136 58 L126 66";
}

function handlePoint(type) {
  if (type === "leg") return [190, 62];
  if (type === "hinge") return [144, 94];
  if (type === "lunge") return [142, 108];
  if (type === "raise") return [132, 30];
  if (type === "pressdown") return [130, 96];
  if (type === "curl") return [116, 44];
  if (type === "face") return [132, 38];
  return [142, 62];
}

document.addEventListener("click", (event) => {
  const scheduleButton = event.target.closest("[data-schedule-day]");
  if (scheduleButton) {
    selectedDay = Number(scheduleButton.dataset.scheduleDay);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const setButton = event.target.closest("[data-set]");
  if (setButton) toggleSet(setButton);

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
$("libraryFilter")?.addEventListener("change", renderLibrary);
$("notes")?.addEventListener("input", (event) => {
  state.notes = event.target.value;
  saveState();
});
$("exportData")?.addEventListener("click", () => {
  $("jsonBox").value = JSON.stringify(workoutData, null, 2);
  $("dataStatus").textContent = "Workout JSON exported below.";
});
$("importData")?.addEventListener("click", () => {
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
$("copyPrompt")?.addEventListener("click", async () => {
  const prompt = `Create 7 new 30-minute Me90X workouts using only these machines: ${workoutData.machines.join(", ")}. Return valid JSON matching this schema: { "version": 1, "machines": string[], "schedule": { "0": string[], "1": string[], "2": string[], "3": string[], "4": string[], "5": string[], "6": string[] }, "workouts": [{ "id": "kebab-case", "name": "Workout name", "focus": "strength|conditioning|hypertrophy|power|mobility", "intent": "plain English sentence", "format": "plain English timing structure", "exercises": [["exercise name","sets","reps","effort","plain English form cue"]] }] }. Use plain English, no gym jargon, and keep each workout around 30 minutes.`;
  await navigator.clipboard.writeText(prompt);
  $("dataStatus").textContent = "Prompt copied.";
});

render();
