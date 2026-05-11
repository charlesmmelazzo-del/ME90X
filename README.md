# Me90X

A static workout tracker for 30-minute machine workouts using:

- Precor FTS Glide cable trainer
- Precor multi-press
- Precor leg press/calf station
- Precor row or pull station

The app shows the assigned workout for each day, gives plain-English exercise instructions, provides simple movement diagrams, tracks set-by-set completion, and stores streaks, notes, and machine loads in browser local storage.

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server.

## GitHub Pages

1. Create a new GitHub repository.
2. Push these files to the repository.
3. In GitHub, open Settings -> Pages.
4. Deploy from the main branch root.

## Updating workouts with ChatGPT

Use the hidden workout JSON tools if you want to swap in new ChatGPT-authored workouts later. New workouts should stay plain-English and keep each session around 30 minutes.

## Evidence basis

The programming logic follows current public health and resistance-training guidance:

- [WHO adult activity guidelines](https://www.who.int/initiatives/behealthy/physical-activity): 150-300 minutes moderate activity or 75-150 vigorous activity weekly, plus muscle strengthening on 2 or more days.
- [CDC adult activity guidance](https://www.cdc.gov/physical-activity-basics/guidelines/adults.html): the same weekly activity targets, with practical support for 30-minute daily chunks.
- [ACSM 2026 resistance training position stand](https://pubmed.ncbi.nlm.nih.gov/41843416/): consistency first; strength responds well to heavier loads, 2-3 sets, and 2+ sessions weekly; hypertrophy responds to higher weekly volume; power uses moderate loads moved quickly.
- [ACSM progression model](https://pubmed.ncbi.nlm.nih.gov/11828249/): increase load roughly 2-10% when the current workload can be exceeded by 1-2 clean reps on repeated exposures.
- [Resistance-training proximity-to-failure review](https://pmc.ncbi.nlm.nih.gov/articles/PMC9935748/): training to momentary failure is not consistently superior, so most sets use 1-3 reps in reserve.
