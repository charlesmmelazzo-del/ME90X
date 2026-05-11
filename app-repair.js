(() => {
  const customKeys = ["me90x:workouts", "machinefit30:workouts"];

  function validWorkoutData(data) {
    return Boolean(
      data &&
      data.schedule &&
      Array.isArray(data.workouts) &&
      data.workouts.length &&
      data.workouts.every((workout) => workout.id && Array.isArray(workout.exercises))
    );
  }

  try {
    if (typeof workoutData !== "undefined" && !validWorkoutData(workoutData)) {
      customKeys.forEach((key) => localStorage.removeItem(key));
      workoutData = window.DEFAULT_WORKOUT_DATA;
    }

    const stillLoading = document.getElementById("workoutName")?.textContent === "Loading...";
    const hasWorkoutCards = Boolean(document.querySelector("[data-exercise-card]"));
    if (typeof render === "function" && (stillLoading || !hasWorkoutCards)) {
      if (typeof currentExerciseIndex !== "undefined") currentExerciseIndex = 0;
      render();
    }
  } catch (error) {
    console.error("Me90X repair failed", error);
  }
})();
