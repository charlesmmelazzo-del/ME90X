const STORAGE_KEY = "me90x:v2";
const LEGACY_STORAGE_KEYS = ["me90x:v1", "machinefit30:v1"];
const CUSTOM_DATA_KEY = "me90x:workouts";
const LEGACY_CUSTOM_DATA_KEY = "machinefit30:workouts";
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let state = loadState();
let workoutData = loadWorkoutData();
let selectedDay = new Date().getDay();
let currentExerciseIndex = 0;

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

const MACHINE_LIBRARY = [
  {
    match: ["leg press", "calf"],
    name: "Leg press / calf machine",
    setup: "Sit with your back flat on the back pad. Put both feet on the large platform. Use the handles beside the seat if the machine has them.",
    adjust: "Move the seat or start position so your knees are bent but comfortable. You should not feel jammed at the bottom.",
    station: "Use the big foot platform. For calf raises, keep only the balls of your feet on the lower part of the platform."
  },
  {
    match: ["multi-press", "chest press", "speed press", "shoulder press"],
    name: "Multi-press machine",
    setup: "Sit with your back against the pad. Adjust the seat so the handles line up around mid-chest for chest press.",
    adjust: "Before you add weight, do one easy test rep. If the handles feel too high in your shoulders, lower the seat. If they feel too low, raise it.",
    station: "Use the main press handles. Keep your feet flat and your ribs down."
  },
  {
    match: ["row station", "seated row"],
    name: "Row / pull station",
    setup: "Sit facing the handles. Put your feet on the foot bar or foot plate. If there is a chest pad, set it so your chest touches it lightly.",
    adjust: "Adjust the seat so you can reach the handles with long arms without rounding your back.",
    station: "Use the row handles. Start tall, then pull your elbows back."
  },
  {
    match: ["lat pulldown", "pulldown"],
    name: "Row / pull station",
    setup: "Sit facing the machine with thighs under the pads if the machine has them. Reach up to the bar without shrugging.",
    adjust: "Set the thigh pad snug enough that you do not lift off the seat when you pull.",
    station: "Use the overhead bar or handles. Pull toward the top of your chest."
  },
  {
    match: ["face pull"],
    name: "Precor FTS Glide cable machine",
    setup: "Stand facing the cable machine. Set both cable pulleys around face height if adjustable.",
    adjust: "Attach the rope or two handles. Start light enough that you can pause with hands beside your face.",
    station: "Use the cable handles. Step back until the cable is gently tight before you start."
  },
  {
    match: ["pallof", "anti-rotation", "anti-twist"],
    name: "Precor FTS Glide cable machine",
    setup: "Stand sideways to one cable. Set the pulley around chest height.",
    adjust: "Hold one handle with both hands at your chest. Step away until the cable tries to turn you.",
    station: "Use one cable handle. Your job is to stay square and not twist."
  },
  {
    match: ["wood chop", "chop", "rotational"],
    name: "Precor FTS Glide cable machine",
    setup: "Stand sideways to one cable. Set the pulley high for a downward chop or low for an upward chop.",
    adjust: "Use one handle. Step far enough away that the cable has gentle tension at the start.",
    station: "Turn your hips and chest together. Keep the motion smooth."
  },
  {
    match: ["triceps", "pressdown"],
    name: "Precor FTS Glide cable machine",
    setup: "Stand facing the cable machine. Set the pulley high.",
    adjust: "Use a rope, straight bar, or handle. Pick a light weight first so your elbows can stay still.",
    station: "Keep elbows close to your ribs and push the handle down."
  },
  {
    match: ["curl"],
    name: "Precor FTS Glide cable machine",
    setup: "Stand facing the cable machine. Set the pulley low.",
    adjust: "Use a straight bar or two handles. Step back until the cable is lightly tight.",
    station: "Keep elbows by your sides and curl the handle up."
  },
  {
    match: ["lateral raise"],
    name: "Precor FTS Glide cable machine",
    setup: "Stand sideways to one low pulley. Hold the handle in the outside hand.",
    adjust: "Start very light. The cable should pull across your body at the bottom.",
    station: "Lift your arm out to the side without shrugging."
  },
  {
    match: ["lunge", "split squat", "assisted squat"],
    name: "Precor FTS Glide cable machine",
    setup: "Stand facing the cable machine and hold the handles lightly for balance.",
    adjust: "Set the pulleys low to mid-height. Use only enough weight to help you balance.",
    station: "Use the handles like support rails, not like something to yank on."
  },
  {
    match: ["romanian deadlift", "rdl", "hinge", "pull-through"],
    name: "Precor FTS Glide cable machine",
    setup: "Use a low cable. Stand facing away for pull-throughs, or facing the machine for cable deadlifts.",
    adjust: "Step far enough away that the cable is tight before you move. Keep the first set light.",
    station: "Move from your hips. Your back should stay quiet."
  },
  {
    match: ["crunch", "dead bug", "march", "hold"],
    name: "Precor FTS Glide cable machine",
    setup: "Use the cable position that matches the move: high for crunches, chest-height for holds, low for dead bug pullovers.",
    adjust: "Start with a light pin. You should feel your middle working, not your low back.",
    station: "Keep the cable controlled the whole time."
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
  currentExerciseIndex = Math.min(currentExerciseIndex, exercises.length - 1);
  $("exerciseList").innerHTML = exercises.map((exercise, index) => renderExercise(exercise, index, workout)).join("");
  renderWorkoutProgress(workout, exercises);
  renderSetDock(workout, exercises);
  requestAnimationFrame(() => scrollToCurrentExercise(false));

  $("progressionAdvice").textContent = buildProgressionAdvice(workout, phase);
  $("loadLog").innerHTML = exercises.map((exercise) => {
    const entry = state.loads[exercise.name];
    const label = entry?.last ? `${entry.last} last used` : suggestedLoad(exercise.name);
    return `<div><strong>${plainName(exercise.name)}</strong><span>${label}. Good sessions before increase: ${entry?.wins || 0}/2</span></div>`;
  }).join("");
}

function renderExercise(exercise, index, workout) {
  const guide = getExerciseGuide(exercise.name);
  const machine = getMachineGuide(exercise.name);
  const totalSets = setCount(exercise.sets);
  const completeSets = countCompleteSets(workout, exercise);
  const loadEntry = state.loads[exercise.name];
  const suggested = suggestedLoad(exercise.name);
  const actual = loadEntry?.last || "";
  const totalWorkoutSets = normalizeExercises(workout).reduce((sum, item) => sum + setCount(item.sets), 0);
  const completeWorkoutSets = normalizeExercises(workout).reduce((sum, item) => sum + countCompleteSets(workout, item), 0);

  return `
    <article class="exercise" data-exercise-card="${index}">
      <div class="cardProgress">
        <span>${completeWorkoutSets} of ${totalWorkoutSets} sets done today</span>
        <div><span style="width: ${totalWorkoutSets ? (completeWorkoutSets / totalWorkoutSets) * 100 : 0}%"></span></div>
      </div>
      <div class="exerciseHeader">
        <span class="exerciseNumber">${index + 1}</span>
        <div>
          <h3>${plainName(exercise.name)}</h3>
          <span class="machineBadge">${machine.name}</span>
          <p>${totalSets} sets. Do ${exercise.reps} reps each set. ${plainEffort(exercise.effort)}</p>
        </div>
      </div>
      <div class="exerciseBody">
        ${movementGuide(guide.type, machine.name)}
        <div class="instructionStack">
          <div class="machineSetup">
            <strong>Machine setup</strong>
            <p>${machine.setup}</p>
            <p>${machine.adjust}</p>
            <p>${machine.station}</p>
          </div>
          <div class="instructionGrid">
            <div><strong>Set up your body</strong><p>${guide.setup}</p></div>
            <div><strong>Do this</strong><p>${guide.action}</p></div>
            <div><strong>Watch out</strong><p>${guide.avoid}</p></div>
          </div>
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
      <p class="cardHint">${completeSets}/${totalSets} sets done here. Use the bottom set buttons while you work.</p>
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

function getMachineGuide(name) {
  const lower = name.toLowerCase();
  return MACHINE_LIBRARY.find((guide) => guide.match.some((term) => lower.includes(term))) || {
    name: "Precor FTS Glide cable machine",
    setup: "Use the cable machine unless this exercise clearly names another machine.",
    adjust: "Choose the pulley height that makes the cable pull in the same direction as the movement.",
    station: "Start light and step away until the cable is gently tight."
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

function renderSetDock(workout, exercises) {
  const exercise = exercises[currentExerciseIndex] || exercises[0];
  if (!exercise) return;
  const totalSets = setCount(exercise.sets);
  const completeSets = countCompleteSets(workout, exercise);
  const setButtons = Array.from({ length: totalSets }, (_, setIndex) => {
    const checked = isSetDone(workout, exercise, setIndex);
    return `<button type="button" class="setButton ${checked ? "done" : ""}" data-set="${setIndex}" data-exercise="${escapeAttr(exercise.name)}">
      Set ${setIndex + 1}
    </button>`;
  }).join("");

  $("setDock").innerHTML = `
    <div class="dockExercise">
      <span>Exercise ${currentExerciseIndex + 1} of ${exercises.length}</span>
      <strong>${plainName(exercise.name)}</strong>
      <small>${completeSets}/${totalSets} sets done - ${exercise.reps} reps per set</small>
    </div>
    <div class="dockSets">${setButtons}</div>
    <div class="dockActions">
      <button type="button" class="ghost dockNav" data-card-nav="prev">Prev</button>
      <button type="button" class="ghost dockNav" data-card-nav="next">Next</button>
      <label class="readiness">
        <span>Felt</span>
        <select id="readiness">
          <option value="good">Good</option>
          <option value="easy">Too easy</option>
          <option value="hard">Too hard</option>
        </select>
      </label>
      <button id="completeWorkout" type="button" class="primary">Complete</button>
    </div>
  `;
  $("completeWorkout").addEventListener("click", markComplete);
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
    readiness: $("readiness")?.value || "good",
    completedAt: new Date().toISOString()
  };
  updateLoads(workout);
  saveState();
  render();
}

function updateLoads(workout) {
  const felt = $("readiness")?.value || "good";
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

function scrollToCurrentExercise(smooth = true) {
  const card = document.querySelector(`[data-exercise-card="${currentExerciseIndex}"]`);
  card?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", inline: "center", block: "nearest" });
}

function updateCurrentCardFromScroll() {
  const list = $("exerciseList");
  if (!list) return;
  const cards = [...list.querySelectorAll("[data-exercise-card]")];
  if (!cards.length) return;
  const closest = cards.reduce((best, card) => {
    const distance = Math.abs(card.getBoundingClientRect().left - list.getBoundingClientRect().left);
    return distance < best.distance ? { card, distance } : best;
  }, { card: cards[0], distance: Infinity }).card;
  const nextIndex = Number(closest.dataset.exerciseCard);
  if (nextIndex !== currentExerciseIndex) {
    currentExerciseIndex = nextIndex;
    const workout = getWorkoutForDay(selectedDay);
    renderSetDock(workout, normalizeExercises(workout));
  }
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

function movementGuide(type, machineName) {
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
      <strong>${machineName}</strong>
      ${diagramSvg(type, machineName)}
      <div><span>${start}</span><span>${finish}</span></div>
    </div>
  `;
}

function diagramSvg(type, machineName) {
  const lowerMachine = machineName.toLowerCase();
  const svg = lowerMachine.includes("leg press")
    ? legPressDiagram()
    : lowerMachine.includes("multi-press")
      ? pressDiagram(type)
      : lowerMachine.includes("row / pull")
        ? rowDiagram(type)
        : cableDiagram(type);
  return addSvgPaint(svg);
}

function addSvgPaint(svg) {
  return svg
    .replace('<style>', '<rect x="8" y="8" width="264" height="146" rx="8" fill="#f5f7f7" stroke="#e0e5e7" stroke-width="1" /><style>')
    .replaceAll('class="machine"', 'class="machine" fill="none" stroke="#687176" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"')
    .replaceAll('class="person"', 'class="person" fill="none" stroke="#2f363a" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"')
    .replaceAll('class="pad"', 'class="pad" fill="#ffffff" stroke="#687176" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"')
    .replaceAll('class="handle"', 'class="handle" fill="#2f363a" stroke="#2f363a" stroke-width="3"')
    .replaceAll('class="arrow"', 'class="arrow" fill="none" stroke="#6faa1f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"');
}

function pressDiagram(type) {
  const arrow = type === "pressdown" ? arrowDown(178, 70, 178, 112) : arrowLine(150, 74, 212, 56);
  return `
    <svg class="machineDiagram" viewBox="0 0 280 170" role="img">
      ${diagramStyles()}
      <path class="machine" d="M34 148 H238 M58 148 V84 M58 84 H104 M104 84 L126 136 M126 136 H170 M190 148 V28 M190 28 H226 M190 60 L236 44 M190 60 L222 86 M226 28 V148" />
      <path class="pad" d="M70 112 L112 72 L128 86 L92 128 Z M72 136 H130" />
      <circle class="person" cx="104" cy="62" r="12" />
      <path class="person" d="M102 74 L118 96 L142 96 M116 96 L98 126 M98 126 L78 146 M116 100 L134 130 M134 130 L158 146" />
      <path class="person" d="M122 86 L156 74 L178 60" />
      <circle class="handle" cx="178" cy="60" r="5" />
      ${arrow}
    </svg>
  `;
}

function legPressDiagram() {
  return `
    <svg class="machineDiagram" viewBox="0 0 280 170" role="img">
      ${diagramStyles()}
      <path class="machine" d="M32 148 H246 M54 148 V110 M54 110 H104 M104 110 L132 148 M194 148 V42 M194 42 H226 M194 42 L238 116 M238 116 V148" />
      <path class="pad" d="M72 120 L126 78 L144 94 L96 138 Z" />
      <path class="machine" d="M206 72 L250 96 M206 112 L250 136" />
      <circle class="person" cx="118" cy="70" r="12" />
      <path class="person" d="M116 82 L130 104 L154 110 M154 110 L206 92 M154 116 L206 126 M130 104 L112 132 M112 132 L84 148" />
      <path class="person" d="M128 96 L150 88" />
      ${arrowLine(178, 102, 226, 92)}
    </svg>
  `;
}

function rowDiagram(type) {
  const overhead = type === "face";
  return `
    <svg class="machineDiagram" viewBox="0 0 280 170" role="img">
      ${diagramStyles()}
      <path class="machine" d="M34 148 H242 M64 148 V92 H116 M116 92 V148 M210 148 V28 M210 28 H244 M210 52 L244 70 M244 28 V148" />
      <path class="pad" d="M82 104 H128 V118 H82 Z M130 76 H146 V126 H130 Z" />
      <circle class="person" cx="108" cy="66" r="12" />
      <path class="person" d="M108 78 L120 102 L140 104 M120 104 L98 132 M98 132 L70 148 M122 104 L144 132 M144 132 L168 148" />
      <path class="person" d="${overhead ? "M121 86 L160 70 L198 52" : "M122 90 L162 88 L198 84"}" />
      <path class="machine" d="${overhead ? "M198 52 L222 42" : "M198 84 L222 80"}" />
      <circle class="handle" cx="198" cy="${overhead ? "52" : "84"}" r="5" />
      ${overhead ? arrowLine(198, 52, 154, 68) : arrowLine(196, 84, 150, 88)}
    </svg>
  `;
}

function cableDiagram(type) {
  const high = ["face", "pressdown", "crunch"].includes(type);
  const low = ["curl", "hinge", "lunge", "raise"].includes(type);
  const pulleyY = high ? 44 : low ? 128 : 82;
  const handleY = type === "pressdown" ? 88 : type === "curl" ? 100 : type === "raise" ? 70 : type === "hinge" ? 118 : type === "face" ? 58 : 82;
  const personX = type === "hinge" ? 126 : 142;
  const arrow = type === "pressdown"
    ? arrowDown(152, 72, 152, 112)
    : type === "curl"
      ? arrowLine(146, 112, 146, 72)
      : type === "raise"
        ? arrowLine(144, 96, 124, 54)
        : type === "hinge"
          ? arrowLine(132, 104, 104, 128)
          : type === "rotate"
            ? curvedArrow()
            : arrowLine(192, handleY, 150, handleY);
  return `
    <svg class="machineDiagram" viewBox="0 0 280 170" role="img">
      ${diagramStyles()}
      <path class="machine" d="M38 148 H242 M58 148 V24 H92 V148 M58 44 H92 M58 84 H92 M58 124 H92 M92 ${pulleyY} L196 ${handleY}" />
      <circle class="handle" cx="196" cy="${handleY}" r="5" />
      <circle class="person" cx="${personX}" cy="54" r="12" />
      <path class="person" d="M${personX} 66 L${personX} 100 L${personX - 22} 148 M${personX} 100 L${personX + 22} 148" />
      <path class="person" d="${cableArmPath(type, personX, handleY)}" />
      ${arrow}
    </svg>
  `;
}

function diagramStyles() {
  return `
    <style>
      .machine{fill:none;stroke:#9da6aa;stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round}
      .person{fill:none;stroke:#6f777b;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
      .pad{fill:#f6f7f7;stroke:#9da6aa;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
      .handle{fill:#6f777b;stroke:#6f777b;stroke-width:3}
      .arrow{fill:none;stroke:#73a82c;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
    </style>
  `;
}

function cableArmPath(type, x, y) {
  if (type === "pressdown") return `M${x} 78 L${x + 12} ${y - 4} L196 ${y}`;
  if (type === "curl") return `M${x} 88 L${x + 16} ${y} L196 ${y}`;
  if (type === "raise") return `M${x} 82 L${x - 8} ${y} L196 ${y}`;
  if (type === "hinge") return `M${x} 92 L${x + 24} ${y} L196 ${y}`;
  return `M${x} 82 L${x + 26} ${y} L196 ${y}`;
}

function arrowLine(x1, y1, x2, y2) {
  return `<path class="arrow" d="M${x1} ${y1} L${x2} ${y2}" />${arrowHead(x1, y1, x2, y2)}`;
}

function arrowDown(x1, y1, x2, y2) {
  return `<path class="arrow" d="M${x1} ${y1} L${x2} ${y2} M${x2 - 9} ${y2 - 11} L${x2} ${y2} L${x2 + 9} ${y2 - 11}" />`;
}

function curvedArrow() {
  return `<path class="arrow" d="M126 72 C154 44 186 48 204 78 M192 68 L204 78 L190 84" />`;
}

function arrowHead(x1, y1, x2, y2) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const left = angle + Math.PI * 0.82;
  const right = angle - Math.PI * 0.82;
  const size = 12;
  const lx = x2 + Math.cos(left) * size;
  const ly = y2 + Math.sin(left) * size;
  const rx = x2 + Math.cos(right) * size;
  const ry = y2 + Math.sin(right) * size;
  return `<path class="arrow" d="M${lx.toFixed(1)} ${ly.toFixed(1)} L${x2} ${y2} L${rx.toFixed(1)} ${ry.toFixed(1)}" />`;
}

document.addEventListener("click", (event) => {
  const scheduleButton = event.target.closest("[data-schedule-day]");
  if (scheduleButton) {
    selectedDay = Number(scheduleButton.dataset.scheduleDay);
    currentExerciseIndex = 0;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const setButton = event.target.closest("[data-set]");
  if (setButton) toggleSet(setButton);

  const navButton = event.target.closest("[data-card-nav]");
  if (navButton) {
    const exercises = normalizeExercises(getWorkoutForDay(selectedDay));
    currentExerciseIndex += navButton.dataset.cardNav === "next" ? 1 : -1;
    currentExerciseIndex = Math.max(0, Math.min(exercises.length - 1, currentExerciseIndex));
    scrollToCurrentExercise();
    renderSetDock(getWorkoutForDay(selectedDay), exercises);
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

$("exerciseList").addEventListener("scroll", () => {
  window.clearTimeout(window.me90xScrollTimer);
  window.me90xScrollTimer = window.setTimeout(updateCurrentCardFromScroll, 80);
});
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
