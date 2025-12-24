const maxSteps = 15;
const stepPx = 18; // distancia visual por paso
let teams = [];
let currentTeam = 0;
let timeLeft = 900;
let timerInterval;

const numTeamsSelect = document.getElementById("numTeams");
const teamsConfig = document.getElementById("teamsConfig");

const logos = [
  "images/logo1.png",
  "images/logo2.png",
  "images/logo3.png",
  "images/logo4.png"
];

numTeamsSelect.addEventListener("change", buildTeamInputs);
buildTeamInputs();

function buildTeamInputs() {
  teamsConfig.innerHTML = "";
  const num = Number(numTeamsSelect.value);

  for (let i = 0; i < num; i++) {
    const row = document.createElement("div");
    row.className = "team-row";

    row.innerHTML = `
      <input placeholder="Nombre equipo ${i + 1}" id="teamName${i}" />
      <select id="teamImg${i}">
        ${logos.map((src, idx) => `<option value="${src}">Logo ${idx + 1}</option>`).join("")}
      </select>
      <img id="teamPreview${i}" class="preview" src="${logos[0]}" alt="preview" />
    `;

    teamsConfig.appendChild(row);

    const select = row.querySelector(`#teamImg${i}`);
    const preview = row.querySelector(`#teamPreview${i}`);
    select.addEventListener("change", () => preview.src = select.value);
  }
}

document.getElementById("startGame").addEventListener("click", startGame);

function startGame() {
  const num = Number(numTeamsSelect.value);
  teams = [];

  for (let i = 0; i < num; i++) {
    const name = document.getElementById(`teamName${i}`).value.trim() || `Equipo ${i + 1}`;
    const image = document.getElementById(`teamImg${i}`).value;

    teams.push({ id: i, name, image, position: 0 });
  }

  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  currentTeam = 0;
  timeLeft = 900;

  renderTeams();
  updateTurnText();
  startTimer();
}

function renderTeams() {
  const track = document.getElementById("teams-track");
  track.innerHTML = "";

  // ✅ Meta colocada al final (paso 15)
  const goal = document.createElement("img");
  goal.src = "images/meta.png";
  goal.className = "goal-icon";
  goal.style.setProperty("--goal-x", `${maxSteps * stepPx}px`);
  goal.alt = "Meta";
  track.appendChild(goal);

  // Equipos
  teams.forEach(team => {
    const img = document.createElement("img");
    img.src = team.image;
    img.className = "team-icon";
    img.alt = team.name;
    img.style.setProperty("--x", `${team.position * stepPx}px`);
    track.appendChild(img);
  });
}

function updateTurnText() {
  document.getElementById("turnText").innerText =
    `Turno del equipo ${teams[currentTeam].name}`;
}

function answer(correct) {
  const team = teams[currentTeam];

  if (correct) {
    team.position = Math.min(maxSteps, team.position + 1);
    if (team.position >= maxSteps) {
      endGame(team.name);
      return;
    }
    // si acierta, sigue jugando
  } else {
    team.position = Math.max(0, team.position - 1);
    currentTeam = (currentTeam + 1) % teams.length;
  }

  renderTeams();
  updateTurnText();
}

function startTimer() {
  clearInterval(timerInterval);
  updateTimerUI();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endByTime();
    }
  }, 1000);
}

function updateTimerUI() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  document.getElementById("timer").innerText =
    `${min}:${sec.toString().padStart(2, "0")}`;
}

function endByTime() {
  let winner = teams[0];
  for (const t of teams) if (t.position > winner.position) winner = t;
  endGame(winner.name, true);
}

function endGame(name, byTime = false) {
  clearInterval(timerInterval);
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("winnerText").innerText =
    byTime ? `¡Tiempo! Gana ${name}` : `¡Ha ganado el equipo ${name}!`;
}
