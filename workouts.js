window.DEFAULT_WORKOUT_DATA = {
  version: 1,
  machines: [
    "Precor FTS Glide cable trainer",
    "Precor multi-press",
    "Precor leg press/calf station",
    "Precor row or pull station"
  ],
  schedule: {
    0: ["recovery-cable-flow", "core-cable-athletic"],
    1: ["push-pull-foundation", "upper-power-press"],
    2: ["legs-engine", "lower-strength-builder"],
    3: ["cable-athlete", "conditioning-ladder"],
    4: ["upper-hypertrophy", "press-row-density"],
    5: ["posterior-chain-cables", "full-body-strength"],
    6: ["p90x3-style-sweat", "mobility-reset"]
  },
  workouts: [
    {
      id: "push-pull-foundation",
      name: "Push/Pull Foundation",
      focus: "strength",
      intent: "A clean upper-body strength day using the multi-press, row station, and cable trainer.",
      format: "3 rounds. Rest 45-60 sec between exercises.",
      exercises: [
        ["Multi-press chest press", "3", "8-12", "2 RIR", "Shoulders down, press smoothly, no bouncing."],
        ["Seated row station", "3", "8-12", "2 RIR", "Pull elbows toward ribs and pause for one count."],
        ["FTS face pull", "2", "12-15", "2 RIR", "Cable high, pull toward eyebrows."],
        ["FTS Pallof press", "2", "10/side", "steady", "Resist rotation; ribs stacked over hips."],
        ["FTS triceps pressdown", "2", "10-14", "2 RIR", "Keep elbows pinned."],
        ["FTS cable curl", "2", "10-14", "2 RIR", "Control the lower."],
      ]
    },
    {
      id: "legs-engine",
      name: "Legs Engine",
      focus: "hypertrophy",
      intent: "Leg strength plus a conditioning finish that fits inside 30 minutes.",
      format: "Main lift first, then a 12-minute density block.",
      exercises: [
        ["Leg press", "4", "8-12", "2 RIR", "Feet shoulder width, knees track over toes."],
        ["Leg press calf raise", "3", "12-18", "2 RIR", "Full stretch, hard top squeeze."],
        ["FTS cable Romanian deadlift", "3", "10-12", "2 RIR", "Hinge from hips; keep lats tight."],
        ["FTS reverse lunge", "2", "8/side", "2 RIR", "Use handles for balance if needed."],
        ["FTS cable crunch", "2", "12-15", "1-2 RIR", "Curl ribs toward pelvis."],
      ]
    },
    {
      id: "cable-athlete",
      name: "Cable Athlete",
      focus: "power",
      intent: "Fast, athletic cable work without beating up your joints.",
      format: "Move fast on power reps. Rest 30-45 sec.",
      exercises: [
        ["FTS cable squat-to-row", "3", "6-8", "fast", "Explode up, row as you stand."],
        ["FTS split-stance press", "3", "8/side", "2 RIR", "Press from low ribs, rotate slightly."],
        ["FTS wood chop", "3", "8/side", "crisp", "Hips and ribs turn together."],
        ["FTS high row", "3", "10-12", "2 RIR", "Drive elbows down and back."],
        ["FTS farmer hold", "3", "30 sec", "strong", "Stand tall; do not lean."],
      ]
    },
    {
      id: "upper-hypertrophy",
      name: "Upper Pump Circuit",
      focus: "hypertrophy",
      intent: "Higher weekly volume for chest, back, shoulders, and arms.",
      format: "Two paired circuits. Rest 30 sec after each pair.",
      exercises: [
        ["Multi-press incline or chest press", "3", "10-12", "1-2 RIR", "Stop one clean rep before form changes."],
        ["Row station neutral row", "3", "10-12", "1-2 RIR", "Squeeze shoulder blades gently."],
        ["FTS cable lateral raise", "3", "12-15", "2 RIR", "Lead with elbows; light is fine."],
        ["FTS kneeling lat pulldown", "3", "10-12", "2 RIR", "Pull elbows to pockets."],
        ["FTS overhead triceps extension", "2", "12-15", "2 RIR", "Stretch at the top."],
        ["FTS hammer curl", "2", "12-15", "2 RIR", "Neutral grip, slow lower."],
      ]
    },
    {
      id: "posterior-chain-cables",
      name: "Posterior Chain Cables",
      focus: "strength",
      intent: "Back, glutes, hamstrings, and anti-rotation work.",
      format: "Steady strength tempo. Rest 45 sec.",
      exercises: [
        ["FTS cable pull-through", "3", "10-12", "2 RIR", "Hips back, snap glutes through."],
        ["Row station", "3", "8-12", "2 RIR", "Pause every rep."],
        ["FTS single-leg RDL", "2", "8/side", "2 RIR", "Soft knee, square hips."],
        ["FTS low-to-high chop", "2", "10/side", "steady", "Smooth diagonal path."],
        ["Leg press calf raise", "3", "12-18", "2 RIR", "No half reps."],
      ]
    },
    {
      id: "p90x3-style-sweat",
      name: "P90X3-Style Sweat",
      focus: "conditioning",
      intent: "A 30-minute machine circuit with the pace and variety you liked from P90X3.",
      format: "40 sec work, 20 sec transition. Repeat 3 rounds.",
      exercises: [
        ["Leg press rhythm reps", "3", "40 sec", "smooth", "Light enough to keep tempo."],
        ["FTS alternating cable press", "3", "40 sec", "steady", "Athletic stance, switch sides halfway."],
        ["FTS squat-to-row", "3", "40 sec", "strong", "Hips back, chest tall."],
        ["Multi-press fast-but-clean press", "3", "40 sec", "2 RIR", "Never lock out hard."],
        ["FTS standing march Pallof", "3", "40 sec", "steady", "Hold press-out while marching."],
      ]
    },
    {
      id: "recovery-cable-flow",
      name: "Recovery Cable Flow",
      focus: "mobility",
      intent: "Keep the streak alive while letting joints and connective tissue recover.",
      format: "Easy continuous movement. No grinding.",
      exercises: [
        ["FTS assisted squat", "2", "10", "easy", "Use cables for counterbalance."],
        ["FTS face pull", "2", "15", "easy", "Open chest and upper back."],
        ["FTS light row", "2", "12", "easy", "Slow and fluid."],
        ["FTS hip hinge pattern", "2", "12", "easy", "Practice range."],
        ["FTS Pallof press hold", "2", "20 sec/side", "easy", "Breathe through the brace."],
        ["Machine-free mobility", "1", "5 min", "easy", "Hips, pecs, hamstrings, calves."],
      ]
    },
    {
      id: "upper-power-press",
      name: "Upper Power Press",
      focus: "power",
      intent: "Moderate loads moved quickly to regain snap and athleticism.",
      format: "Power sets first, then controlled accessories.",
      exercises: [
        ["Multi-press speed press", "5", "5", "fast", "Use a load you can accelerate."],
        ["FTS explosive row", "4", "6", "fast", "Pull quickly, return under control."],
        ["FTS rotational press", "3", "8/side", "crisp", "Pivot lightly through the hips."],
        ["FTS face pull", "2", "12-15", "2 RIR", "Shoulder health finisher."],
        ["FTS dead bug pullover", "2", "8/side", "steady", "Low back stays quiet."],
      ]
    },
    {
      id: "lower-strength-builder",
      name: "Lower Strength Builder",
      focus: "strength",
      intent: "Leg press strength with enough unilateral work to keep your hips honest.",
      format: "Rest 60 sec after leg press, 30-45 sec elsewhere.",
      exercises: [
        ["Leg press", "5", "6-8", "2 RIR", "Heavier day, clean depth."],
        ["FTS supported split squat", "3", "8/side", "2 RIR", "Back knee drops straight down."],
        ["FTS cable hamstring curl", "2", "10/side", "2 RIR", "Use ankle strap if available."],
        ["Leg press calf raise", "3", "10-15", "2 RIR", "Pause at top."],
        ["FTS anti-rotation hold", "2", "25 sec/side", "steady", "Do not let cable twist you."],
      ]
    },
    {
      id: "conditioning-ladder",
      name: "Conditioning Ladder",
      focus: "conditioning",
      intent: "Simple escalating rounds that make 30 minutes feel focused and competitive.",
      format: "Do 6, 8, 10, 12 reps, then repeat if time remains.",
      exercises: [
        ["FTS squat-to-row", "4", "6-12", "moderate", "Add reps each ladder rung."],
        ["Multi-press chest press", "4", "6-12", "moderate", "Same load across ladder."],
        ["Leg press", "4", "6-12", "moderate", "No lockout slam."],
        ["FTS cable chop", "4", "6-12/side", "moderate", "Rotate with control."],
      ]
    },
    {
      id: "press-row-density",
      name: "Press/Row Density",
      focus: "hypertrophy",
      intent: "Maximum useful upper-body work in minimum time.",
      format: "15-minute alternating block, then 10-minute accessory block.",
      exercises: [
        ["Multi-press chest press", "5", "8", "2 RIR", "Alternate with rows."],
        ["Row station", "5", "8", "2 RIR", "Start each minute if using a timer."],
        ["FTS lateral raise", "3", "12", "2 RIR", "Light and strict."],
        ["FTS straight-arm pulldown", "3", "12", "2 RIR", "Feel lats, not low back."],
        ["FTS curl to pressdown superset", "2", "10 each", "2 RIR", "Move briskly."],
      ]
    },
    {
      id: "full-body-strength",
      name: "Full-Body Strength",
      focus: "strength",
      intent: "The weekly anchor: push, pull, legs, hinge, core.",
      format: "2-3 work sets, crisp reps, leave some gas in the tank.",
      exercises: [
        ["Leg press", "3", "8-10", "2 RIR", "Strong drive through midfoot."],
        ["Multi-press chest press", "3", "8-10", "2 RIR", "Controlled lower."],
        ["Row station", "3", "8-10", "2 RIR", "No torso heaving."],
        ["FTS cable RDL", "3", "10", "2 RIR", "Hamstrings loaded."],
        ["FTS Pallof press", "2", "10/side", "steady", "Tall posture."],
      ]
    },
    {
      id: "core-cable-athletic",
      name: "Core Cable Athletic",
      focus: "mobility",
      intent: "A lower-stress day that still trains rotation, bracing, and posture.",
      format: "Continuous flow, light to moderate loads.",
      exercises: [
        ["FTS Pallof press", "3", "10/side", "steady", "Press and pause."],
        ["FTS wood chop", "3", "10/side", "steady", "Control the return."],
        ["FTS half-kneeling row", "3", "10/side", "2 RIR", "Glute squeezed on down knee side."],
        ["FTS assisted reverse lunge", "2", "8/side", "easy", "Use cable for balance."],
        ["FTS face pull", "2", "15", "easy", "Finish feeling better."],
      ]
    },
    {
      id: "mobility-reset",
      name: "Mobility Reset",
      focus: "mobility",
      intent: "A streak-preserving tune-up for hips, shoulders, and trunk.",
      format: "Low load. Move with control and breathe.",
      exercises: [
        ["FTS assisted deep squat hold", "3", "30 sec", "easy", "Let hips open."],
        ["FTS pec fly stretch press", "2", "10", "easy", "Small range if shoulders complain."],
        ["FTS lat stretch pulldown", "2", "10", "easy", "Reach long, pull lightly."],
        ["Machine-free world's greatest stretch", "2", "5/side", "easy", "Slow and deliberate."],
        ["FTS Pallof breathing hold", "2", "30 sec/side", "easy", "Nasal breaths."],
      ]
    }
  ]
};
