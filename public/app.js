const roleSelect = document.getElementById('roleSelect');
const levelSelect = document.getElementById('levelSelect');
const startBtn = document.getElementById('startBtn');
const endBtn = document.getElementById('endBtn');
const messagesEl = document.getElementById('messages');
const sendBtn = document.getElementById('sendBtn');
const inputEl = document.getElementById('input');
const infoRole = document.getElementById('infoRole');
const infoLevel = document.getElementById('infoLevel');
const roundsEl = document.getElementById('rounds');
const transcriptEl = document.getElementById('transcript');
const micBtn = document.getElementById("micBtn");

let sessionActive = false;
let conv = [];
let roundCount = 0;
let lastBotMessage = "";


function appendMessage(text, who = "bot") {
  const d = document.createElement("div");
  d.className = `msg ${who}`;
  d.textContent = text;
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function setSessionInfo() {
  infoRole.textContent = roleSelect.value;
  infoLevel.textContent = levelSelect.value;
  roundsEl.textContent = roundCount;
}

let femaleVoice = null;

function speak(text) {
  if (!text) return;

  speechSynthesis.cancel();

  const loadVoices = () => {
    const voices = speechSynthesis.getVoices();
    console.log("Voices:", voices);

    femaleVoice =
      voices.find(v => v.name.includes("Microsoft Zira"));

    return femaleVoice;
  };

  if (!femaleVoice) {
    if (!loadVoices()) {
      setTimeout(() => speak(text), 200);
      return;
    }
  }

  const u = new SpeechSynthesisUtterance(text);
  u.voice = femaleVoice;
  u.lang = femaleVoice.lang;

  u.pitch = 1.0;
  u.rate = 0.93;
  u.volume = 0.92;

  speechSynthesis.speak(u);
}

startBtn.addEventListener("click", () => {
  if (sessionActive) return;
  sessionActive = true;

  messagesEl.innerHTML = "";
  transcriptEl.innerHTML = "";
  conv = [];
  roundCount = 0;

  setSessionInfo();
  startBtn.disabled = true;
  endBtn.disabled = false;

  const sys = `You are an interviewer for the role: ${roleSelect.value} (${levelSelect.value}). 
Ask one question at a time. After each candidate answer, ask 1–3 follow-up questions. 
When requested, generate final structured feedback. Feedback should be short and effective dont use any special symbols while generating feedback. keep as plain text`;

  conv.push({ role: "system", content: sys });

  const opening = `Hi! I'm your mock interviewer for ${roleSelect.value}. Ready to begin?`;

  appendMessage(opening, "bot");
  conv.push({ role: "assistant", content: opening });
  lastBotMessage = opening;

  setTimeout(() => speak(opening), 300);
});


sendBtn.addEventListener("click", sendMessage);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  conv.push({ role: "user", content: text });
  transcriptEl.textContent += `\nUser: ${text}`;
  inputEl.value = "";

  roundCount++;
  setSessionInfo();

  appendMessage("Thinking...", "bot");

  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conv, mode: "continue" }),
    });

    const data = await res.json();
    messagesEl.lastChild.remove();

    const reply = data.reply || "Sorry, try again!";
    appendMessage(reply, "bot");
    conv.push({ role: "assistant", content: reply });
    transcriptEl.textContent += `\nInterviewer: ${reply}`;
    lastBotMessage = reply;

    setTimeout(() => speak(reply), 300);

  } catch (err) {
    messagesEl.lastChild.remove();
    appendMessage("Server error.", "bot");
  }
}


endBtn.addEventListener("click", async () => {
  appendMessage("Generating feedback...", "bot");

  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conv, mode: "feedback" }),
    });

    const data = await res.json();
    messagesEl.lastChild.remove();

    const feedback = "--- Feedback ---\n" + data.reply;
    appendMessage(feedback, "bot");
    lastBotMessage = data.reply;

    setTimeout(() => speak(data.reply), 300);

  } catch {
    appendMessage("Error getting feedback.", "bot");
  }

  sessionActive = false;
  startBtn.disabled = false;
  endBtn.disabled = true;
});


let recognition;
let recognizing = false;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    recognizing = true;
    micBtn.style.background = "rgba(96,165,250,0.4)";
  };

  recognition.onend = () => {
    recognizing = false;
    micBtn.style.background = "rgba(255,255,255,0.1)";
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    inputEl.value = text;
  };
}

micBtn.addEventListener("click", () => {
  if (!recognition) return;

  if (!recognizing) recognition.start();
  else recognition.stop();
});
const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", () => {
  const transcript = transcriptEl.textContent.trim();

  if (!transcript) {
    alert("Transcript is empty!");
    return;
  }

  const blob = new Blob([transcript], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "interview_transcript.txt";
  a.click();

  URL.revokeObjectURL(url);
});
