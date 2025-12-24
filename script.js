const maxSteps = 15;
let teams = [];
let currentTeam = 0;
let timeLeft = 900;
let timerInterval;

const numTeamsSelect = document.getElementById("numTeams");
const teamsConfig = document.getElementById("teamsConfig");

numTeamsSelect.addEventListener("change", buildTeamInputs);
buildTeamInputs();

function buildTeamInputs() {
  teamsConfig.innerHTML = "";
  const num = Number(numTeamsSelect.value);

  for (let i = 0; i < num; i++) {
    teamsConfig.innerHTML += `
      <div>
        <input placeholder="Nombre equipo ${i + 1}" id="teamName${i}">
        <input placeholder="URL imagen" id="teamImg${i}">
      </div>
    `;
  }
}

document.getElementById("startGame").addEventListener("click", startGame);

function startGame() {
  const num = Number(numTeamsSelect.value);
  teams = [];

  for (let i = 0; i < num; i++) {
    teams.push({
      name: document.getElementById(`teamName${i}`).value || `Equipo ${i + 1}`,
      image: document.getElementById(`teamImg${i}`).value,
      position: 0
    });
  }

  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  renderTeams();
  updateTurnText();
  startTimer();
}

function renderTeams() {
  const track = document.getElementById("teams-track");
  track.innerHTML = "";

  teams.forEach(team => {
    const img = document.createElement("img");
    img.src = team.image;
    img.className = "team-icon";
    img.style.left = `${team.position * 20}px`;
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
    team.position++;
    if (team.position >= maxSteps) {
      endGame(team.name);
      return;
    }
  } else {
    team.position = Math.max(0, team.position - 1);
    currentTeam = (currentTeam + 1) % teams.length;
  }

  renderTeams();
  updateTurnText();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    document.getElementById("timer").innerText =
      `${min}:${sec.toString().padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endByTime();
    }
  }, 1000);
}

function endByTime() {
  const winner = teams.reduce((a, b) => a.position > b.position ? a : b);
  endGame(winner.name);
}

function endGame(name) {
  clearInterval(timerInterval);
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("winnerText").innerText =
    `¡Ha ganado el equipo ${name}!`;
}
