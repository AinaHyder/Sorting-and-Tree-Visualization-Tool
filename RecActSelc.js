// Recursive Activity Selector Function
function recursiveActivitySelector(activities, k, n, steps) {
    let m = k + 1;
  
    // Find the next valid activity (start >= finish[k])
    while (m < n && activities[m].start < activities[k].finish) {
      steps.push(`Skipping ${activities[m].id}: start=${activities[m].start} < finish=${activities[k].finish}`);
      m++;
    }
  
    // If a valid activity is found, select it
    if (m < n) {
      steps.push(`Selecting ${activities[m].id}: start=${activities[m].start}, finish=${activities[m].finish}`);
      // Recursively find the next activity
      return [activities[m].id, ...recursiveActivitySelector(activities, m, n, steps)];
    } else {
      steps.push("No more activities to select.");
      return [];
    }
  }
  
  // Entry point to select activities
  function selectActivities(startTimes, finishTimes) {
    const activities = startTimes.map((start, i) => ({
      id: `a${i + 1}`,
      start: start,
      finish: finishTimes[i],
    }));
  
    // Sort activities by finish times
    activities.sort((a, b) => a.finish - b.finish);
  
    const steps = [];
    steps.push(`Selecting ${activities[0].id}: start=${activities[0].start}, finish=${activities[0].finish}`);
  
    // Recursively select activities
    const selectedActivities = [
      activities[0].id,
      ...recursiveActivitySelector(activities, 0, activities.length, steps),
    ];
  
    return { steps, selectedActivities };
  }
  
  // Visualization Logic
  document.getElementById("visualizeButton").addEventListener("click", () => {
    const startInput = document.getElementById("startTimes").value;
    const finishInput = document.getElementById("finishTimes").value;
  
    const startTimes = startInput.split(",").map(Number);
    const finishTimes = finishInput.split(",").map(Number);
  
    // Validate inputs
    if (startTimes.length !== finishTimes.length || startTimes.some(isNaN) || finishTimes.some(isNaN)) {
      alert("Please ensure both inputs are valid and have the same number of values.");
      return;
    }
  
    const { steps, selectedActivities } = selectActivities(startTimes, finishTimes);
  
    const stepLog = document.getElementById("stepLog");
    const resultDisplay = document.getElementById("result");
    stepLog.innerHTML = '';
    resultDisplay.innerHTML = '';
  
    let delay = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        const logEntry = document.createElement('div');
        logEntry.textContent = step;
        if (index === steps.length - 1) logEntry.classList.add('highlight');
        stepLog.appendChild(logEntry);
      }, delay);
      delay += 1000; // Delay of 1 second for each step
    });
  
    setTimeout(() => {
      resultDisplay.textContent = `The set of non-overlapping activities is: {${selectedActivities.join(', ')}}`;
    }, delay);
  });
  