let totalSeconds = 300; // Set duration (e.g., 5 minutes = 300 seconds)
let remainingSeconds = totalSeconds;
let timerInterval = null;

const display = document.getElementById('timerDisplay');
const progressBar = document.getElementById('timerBar');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  // Pad with leading zeros
  display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Calculate percentage and update progress bar width
  const percentage = (remainingSeconds / totalSeconds) * 100;
  progressBar.style.width = `${percentage}%`;

  // Visual cues: change color if time gets critically low (under 20%)
  if (percentage <= 20) {
    progressBar.classList.remove('bg-primary');
    progressBar.classList.add('bg-danger');
    display.classList.remove('text-primary');
    display.classList.add('text-danger');
  } else {
    progressBar.classList.remove('bg-danger');
    progressBar.classList.add('bg-primary');
    display.classList.remove('text-danger');
    display.classList.add('text-primary');
  }
}

function startTimer(sound) {
  if (timerInterval !== null) return; // Prevent multiple intervals running
  requestWakeLock();
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timerInterval = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      display.textContent = "00:00";
      progressBar.style.width = "0%";
      var aud = new Audio(sound);
      aud.play();
      setTimeout(100);
      alert("Time is up!");
      resetTimer();
      return;
    }
    
    remainingSeconds--;
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
    releaseWakeLock();
  clearInterval(timerInterval);
  timerInterval = null;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  pauseTimer();
  remainingSeconds = totalSeconds;
  updateDisplay();
  pauseBtn.disabled = true;
}

// Run initially to set the exact starting layout
updateDisplay();