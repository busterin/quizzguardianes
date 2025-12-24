const maxSteps = 15;
const stepPx = 28;

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

/* CONFIG EQUIPOS */
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

/* START */
document.getElementById("startGame").addEventListener("click", ()=>{
  teams = [];
  const num = Number(numTeamsSelect.value);

  for(let i=0;i<num;i++){
    teams.push({
      name: document.getElementById(`teamName${i}`).value || `Equipo ${i+1}`,
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

/* RENDER */
function renderTeams(){
  const track = document.getElementById("teams-track");
  track.innerHTML = "";

  const goal = document.createElement("img");
  goal.src = "images/meta.png";
  goal.className = "goal-icon";
  goal.style.setProperty("--goal-x", `${maxSteps * stepPx}px`);
  track.appendChild(goal);

  teams.forEach(t=>{
    const img = document.createElement("img");
    img.src = t.image;
    img.className = "team-icon";
    img.style.setProperty("--x", `${t.position * stepPx}px`);
    track.appendChild(img);
  });
}

function updateTurn(){
  document.getElementById("turnText").innerText =
    `Turno del equipo ${teams[currentTeam].name}`;
}

/* RESPUESTA */
function answer(ok){
  const t = teams[currentTeam];

  if(ok){
    t.position++;
    if(t.position >= maxSteps){
      endGame(t.name);
      return;
    }
  }else{
    t.position = Math.max(0, t.position - 1);
    currentTeam = (currentTeam + 1) % teams.length;
  }

  renderTeams();
  updateTurn();
}

/* TIMER */
function startTimer(){
  clearInterval(timerInterval);
  timerInterval = setInterval(()=>{
    timeLeft--;
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById("timer").innerText =
      `${m}:${s.toString().padStart(2,"0")}`;

    if(timeLeft <= 0){
      clearInterval(timerInterval);
      endByTime();
    }
  },1000);
}

function endByTime(){
  let winner = teams.reduce((a,b)=> b.position>a.position?b:a);
  endGame(winner.name);
}

function endGame(name){
  clearInterval(timerInterval);
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("winnerText").innerText =
    `¡Ha ganado ${name}!`;
}
