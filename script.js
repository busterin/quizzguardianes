const maxSteps = 15;
const stepPx = 44; // distancia visual por paso

let teams = [];
let currentTeam = 0;
let timeLeft = 900;
let timerInterval;

const logos = [
  "images/logo1.png",
  "images/logo2.png",
  "images/logo3.png",
  "images/logo4.png"
];

const numTeamsSelect = document.getElementById("numTeams");
const teamsConfig = document.getElementById("teamsConfig");

numTeamsSelect.addEventListener("change", buildTeamInputs);
buildTeamInputs();

function buildTeamInputs(){
  teamsConfig.innerHTML = "";
  const num = Number(numTeamsSelect.value);

  for(let i=0;i<num;i++){
    const row = document.createElement("div");
    row.className = "team-row";

    row.innerHTML = `
      <input id="teamName${i}" placeholder="Nombre equipo ${i+1}">
      <select id="teamImg${i}">
        ${logos.map((l,idx)=>`<option value="${l}">Logo ${idx+1}</option>`).join("")}
      </select>
      <img class="preview" id="preview${i}" src="${logos[0]}">
    `;

    teamsConfig.appendChild(row);

    row.querySelector(`#teamImg${i}`).addEventListener("change", e=>{
      row.querySelector(`#preview${i}`).src = e.target.value;
    });
  }
}

document.getElementById("startGame").addEventListener("click", ()=>{
  teams = [];
  const num = Number(numTeamsSelect.value);

  for(let i=0;i<num;i++){
    teams.push({
      name: (document.getElementById(`teamName${i}`).value || `Equipo ${i+1}`).trim(),
      image: document.getElementById(`teamImg${i}`).value,
      position: 0
    });
  }

  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  currentTeam = 0;
  timeLeft = 900;

  renderTeams();
  updateTurn();
  startTimer();
});

function renderTeams(){
  const track = document.getElementById("teams-track");
  track.innerHTML = "";

  // Meta en el último paso (mismo origen left:0)
  const goal = document.createElement("img");
  goal.src = "images/meta.png";
  goal.className = "goal-icon";
  goal.style.setProperty("--goal-x", `${maxSteps * stepPx}px`);
  goal.alt = "Meta";
  track.appendChild(goal);

  // Todos los equipos comparten el mismo inicio (x=0) y el mismo final (x=maxSteps*stepPx)
  teams.forEach((t)=>{
    const img = document.createElement("img");
    img.src = t.image;
    img.className = "team-icon";
    img.alt = t.name;
    img.style.setProperty("--x", `${t.position * stepPx}px`);
    track.appendChild(img);
  });
}

function updateTurn(){
  document.getElementById("turnText").innerText =
    `Turno del equipo ${teams[currentTeam].name}`;
}

function answer(ok){
  const t = teams[currentTeam];

  if(ok){
    t.position = Math.min(maxSteps, t.position + 1);
    if(t.position >= maxSteps){
      endGame(t.name, false);
      return;
    }
    // si acierta, sigue jugando
  }else{
    t.position = Math.max(0, t.position - 1);
    currentTeam = (currentTeam + 1) % teams.length;
  }

  renderTeams();
  updateTurn();
}

function startTimer(){
  clearInterval(timerInterval);
  updateTimerText();

  timerInterval = setInterval(()=>{
    timeLeft--;
    updateTimerText();

    if(timeLeft <= 0){
      clearInterval(timerInterval);
      endByTime();
    }
  },1000);
}

function updateTimerText(){
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  document.getElementById("timer").innerText =
    `${m}:${s.toString().padStart(2,"0")}`;
}

function endByTime(){
  // mayor posición gana; en empate, el primero del array
  let winner = teams[0];
  for(const t of teams){
    if(t.position > winner.position) winner = t;
  }
  endGame(winner.name, true);
}

function endGame(name, byTime){
  clearInterval(timerInterval);
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("winnerText").innerText =
    byTime ? `¡Tiempo! Gana ${name}` : `¡Ha ganado ${name}!`;
}
