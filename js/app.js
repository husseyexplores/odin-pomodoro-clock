/*
 * HELPER FUNCTIONS
 */
// Minute to Seconds
const minToSec = min => min * 60;
// Convert seconds to 00:25:00 format
const leadingZero = n => (n > 9 ? n : "0" + n);
const secToTimeStr = sec => {
  let hour = 0;
  let min = 0;

  hour = Math.floor(sec / 3600);
  min = Math.floor((sec - hour * 3600) / 60);
  sec = sec - hour * 3600 - min * 60;

  return hour > 0
    ? leadingZero(hour) + ":" + leadingZero(min) + ":" + leadingZero(sec)
    : leadingZero(min) + ":" + leadingZero(sec);
};

const selectors = {
  sessionTime: document.querySelector("#session-time"),
  sessionMinus: document.querySelector("#session-minus"),
  sessionPlus: document.querySelector("#session-plus"),
  breakTime: document.querySelector("#break-time"),
  breakMinus: document.querySelector("#break-minus"),
  breakPlus: document.querySelector("#break-plus"),
  mainTimeText: document.querySelector("#main-text"),
  mainTime: document.querySelector("#main-time"),
  start: document.querySelector("#start"),
  reset: document.querySelector("#reset"),
  countdownWraper: document.querySelector("#countdown-wrapper")
};
const tingting = new Audio("tingting.wav");
let currentSession = "WORK";
let isTicking = false;
let timerInterval;
let timerSeconds =
  minToSec(selectors.sessionTime.innerHTML.split(":")[0]) +
  Number(selectors.sessionTime.innerHTML.split(":")[1]);

/* 
 * CLICK HANDLERS 
 */
// SESSION TIME
selectors.sessionMinus.addEventListener("click", () => {
  const sMinsArr = selectors.sessionTime.innerHTML.split(":");
  // if current min is 1, return false;
  if (sMinsArr[0] == 1) return;
  // otherwise decrement by 1
  sMinsArr[0]--;
  // update the both outputs
  selectors.sessionTime.innerHTML = sMinsArr.join(":");
  // if timer is going on, don't up main timer text
  if (isTicking) return;
  selectors.mainTime.innerHTML = sMinsArr.join(":");
});
selectors.sessionPlus.addEventListener("click", () => {
  const sMinsArr = selectors.sessionTime.innerHTML.split(":");
  sMinsArr[0]++;
  // update the both outputs
  selectors.sessionTime.innerHTML = sMinsArr.join(":");
  // if timer is going on, don't up main timer text
  if (isTicking) return;
  selectors.mainTime.innerHTML = sMinsArr.join(":");
});

// BREAK TIME
selectors.breakMinus.addEventListener("click", () => {
  const sMinsArr = selectors.breakTime.innerHTML.split(":");
  // if current min is 1, return false;
  if (sMinsArr[0] == 1) return;
  // otherwise decrement by 1
  sMinsArr[0]--;
  // update the output
  selectors.breakTime.innerHTML = sMinsArr.join(":");
});
selectors.breakPlus.addEventListener("click", () => {
  const sMinsArr = selectors.breakTime.innerHTML.split(":");
  sMinsArr[0]++;
  // update the output
  selectors.breakTime.innerHTML = sMinsArr.join(":");
});

/*
 * TIMER FUNCTIONS
 */
// SESSION TIMER
const reset = () => {
  clearInterval(timerInterval);
  isTicking = false;
  selectors.mainTimeText.innerHTML = "WORK WORK~";
  selectors.mainTime.innerHTML = selectors.sessionTime.innerHTML;
};

const pause = () => {
  if (isTicking) {
    clearInterval(timerInterval);
    isTicking = false;
  } else {
    if (currentSession === "WORK") {
      startSession(
        minToSec(selectors.mainTime.innerHTML.split(":")[0]) +
          Number(selectors.mainTime.innerHTML.split(":")[1])
      );
    } else if (currentSession === "BREAK") {
      startBreak(
        minToSec(selectors.mainTime.innerHTML.split(":")[0]) +
          Number(selectors.mainTime.innerHTML.split(":")[1])
      );
    }
  }
};

// SESSION FUNCTION
const startSession = timersec => {
  if (!isTicking) {
    // convert mins to secs
    timerSeconds = timersec;
    console.log({ startSession: timersec });
    currentSession = "WORK";

    isTicking = true;

    timerInterval = setInterval(() => {
      if (timerSeconds == 0) {
        // audio time = 0
        tingting.currentTime = 0;
        // play the audio
        tingting.play();
        isTicking = false;
        // update the current session time output
        selectors.mainTime.innerHTML = selectors.breakTime.innerHTML;
        // update the current session text output
        selectors.mainTimeText.innerHTML = "BREAK TIME!";
        // clear interval
        clearInterval(timerInterval);
        // call break function and pass current break time in seconds.
        startBreak(
          minToSec(selectors.breakTime.innerHTML.split(":")[0]) +
            Number(selectors.breakTime.innerHTML.split(":")[1])
        );
      } else {
        timerSeconds--;
        // update the timer output
        selectors.mainTime.innerHTML = secToTimeStr(timerSeconds);
      }
    }, 1000);
  }
};

// BREAK FUNCTION
const startBreak = timersec => {
  if (!isTicking) {
    // convert mins to secs
    timerSeconds = timersec;

    currentSession = "BREAK";

    console.log({ breakTime: timersec });

    isTicking = true;
    timerInterval = setInterval(() => {
      if (timerSeconds == 0) {
        // audio time = 0
        tingting.currentTime = 0;
        // play the audio
        tingting.play();
        isTicking = false;
        // update the current session time output
        selectors.mainTime.innerHTML = selectors.sessionTime.innerHTML;
        // update the current session text output
        selectors.mainTimeText.innerHTML = "WORK WORK~";
        // clear interval
        clearInterval(timerInterval);
        // call session function and pass current break time in seconds.
        startSession(
          minToSec(selectors.mainTime.innerHTML.split(":")[0]) +
            Number(selectors.mainTime.innerHTML.split(":")[1])
        );
      } else {
        timerSeconds--;
        // update the timer output
        selectors.mainTime.innerHTML = secToTimeStr(timerSeconds);
      }
    }, 1000);
  }
};

// START BUTTON LISTENER
selectors.start.addEventListener("click", () => {
  startSession(
    minToSec(selectors.mainTime.innerHTML.split(":")[0]) +
      Number(selectors.mainTime.innerHTML.split(":")[1])
  );
});

// RESET BUTTON LISTENER
selectors.reset.addEventListener("click", reset);

// PAUSE LISTENER
selectors.countdownWraper.addEventListener("click", pause);
