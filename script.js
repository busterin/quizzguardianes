const maxSteps = 15;
const stepPx = 44;

let teams = [];
let currentTeam = 0;
let timeLeft = 900;
let timerInterval;

// ===== PREGUNTAS (30) =====
const QUESTIONS = [
  { q: "¿Qué es una hucha?", o: ["Un banco digital","Un lugar para gastar dinero","Un recipiente para guardar dinero","Una tarjeta de crédito"], a: 2 },
  { q: "¿Cuál es la mejor forma de ahorrar dinero?", o: ["Gastarlo todo en juguetes","Guardar una parte sin gastarla","Pedir más dinero","No ir al colegio"], a: 1 },
  { q: "¿Qué es el precio de un producto?", o: ["Lo que te regalan con él","El número de serie","Lo que cuesta","El nombre del fabricante"], a: 2 },
  { q: "¿Qué es un presupuesto?", o: ["Un juego de mesa","Un billete especial","Un plan para organizar ingresos y gastos","Una calculadora"], a: 2 },
  { q: "¿Qué es una tarjeta de débito?", o: ["Una tarjeta para videojuegos","Una tarjeta que permite pagar con el dinero que tienes","Una tarjeta que da dinero gratis","Una entrada de cine"], a: 1 },
  { q: "¿Qué significa \"ingresos\"?", o: ["Dinero que ganas o recibes","Dinero que pierdes","Dinero que prestas","Dinero que se pierde en juegos"], a: 0 },
  { q: "¿Qué es el ahorro?", o: ["Comprar más cosas","Guardar dinero para el futuro","Usar todas las monedas","Jugar con billetes"], a: 1 },
  { q: "¿Qué es un gasto necesario?", o: ["Un videojuego","Ropa de marca","Comida y vivienda","Un helado"], a: 2 },
  { q: "¿Qué es una necesidad?", o: ["Algo que quiero","Algo que no tiene precio","Algo básico para vivir","Algo divertido"], a: 2 },
  { q: "¿Qué es el trabajo?", o: ["Una excursión","Una actividad que da ingresos","Un regalo","Una fiesta"], a: 1 },
  { q: "¿Qué es un banco?", o: ["Un sitio para jugar","Un lugar para guardar dinero de forma segura","Una tienda de ropa","Un parque"], a: 1 },
  { q: "¿Qué es una inversión?", o: ["Gastar dinero sin pensar","Prestar dinero a un amigo","Usar dinero para ganar más en el futuro","Comprar caramelos"], a: 2 },
  { q: "¿Qué es el interés?", o: ["Dinero que se pierde","Dinero extra que se gana o se paga","Un billete especial","Una tienda"], a: 1 },
  { q: "¿Para qué sirven los impuestos?", o: ["Para comprar juguetes","Para ayudar a financiar servicios públicos","Para jugar al Monopoly","Para regalar dinero"], a: 1 },
  { q: "¿Qué es una deuda?", o: ["Dinero que te deben","Dinero que debes devolver","Dinero perdido","Un premio"], a: 1 },
  { q: "¿Qué es una tarjeta de crédito?", o: ["Una entrada al cine","Una tarjeta para hacer dibujos","Una tarjeta que permite usar dinero prestado","Un carné de biblioteca"], a: 2 },
  { q: "¿Qué es una moneda?", o: ["Un juguete","Dinero en forma de metal","Una piedra preciosa","Una tarjeta"], a: 1 },
  { q: "¿Qué es un cajero automático?", o: ["Una máquina para sacar dinero","Una caja de juguetes","Un buzón","Un robot"], a: 0 },
  { q: "¿Qué es una factura?", o: ["Una entrada","Un comprobante de compra","Un regalo","Un menú"], a: 1 },
  { q: "¿Qué es el precio justo?", o: ["Un precio muy alto","Un precio adecuado al producto","Un precio inventado","Un precio aleatorio"], a: 1 },
  { q: "¿Qué es una tienda online?", o: ["Una tienda sin productos","Una tienda en internet","Una tienda subterránea","Una aplicación de juegos"], a: 1 },
  { q: "¿Qué es comparar precios?", o: ["Comprar todo sin mirar","Ver qué cuesta cada producto en diferentes lugares","Devolver productos","Coger cosas sin pagar"], a: 1 },
  { q: "¿Qué es el poder adquisitivo?", o: ["La capacidad para gastar sin límite","Lo que puedes comprar con tu dinero","Un superpoder","El valor de una casa"], a: 1 },
  { q: "¿Qué es una meta de ahorro?", o: ["Una cantidad de caramelos","Un objetivo para ahorrar dinero","Un lugar donde esconder monedas","Una nota en clase"], a: 1 },
  { q: "¿Qué es un ingreso fijo?", o: ["Un premio ocasional","Un regalo sorpresa","Dinero que recibes con regularidad","Una apuesta"], a: 2 },
  { q: "¿Qué es una cuenta bancaria?", o: ["Un juego de números","Una caja secreta","Un lugar donde se guarda y se controla el dinero","Una hucha con ruedas"], a: 2 },
  { q: "¿Qué es el consumo responsable?", o: ["Comprar sin pensar","Comprar solo lo que necesitas y cuidar el medio ambiente","Gastar todo el dinero","Regalar billetes"], a: 1 },
  { q: "¿Qué es una pensión?", o: ["Un hotel","Dinero que se da cuando una persona se jubila","Un préstamo","Un cheque"], a: 1 },
  { q: "¿Qué es una moneda digital?", o: ["Una moneda de plástico","Dinero que solo existe en videojuegos","Dinero que se usa por internet","Una aplicación"], a: 2 },
  { q: "¿Qué es una subvención?", o: ["Dinero que se paga en una tienda","Dinero que se regala por sorteo","Ayuda económica que da el gobierno","Un impuesto"], a: 2 },
];

// mazo barajado
let questionBag = [];
let currentQuestion = null;
let answeringLocked = false;

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

// ===== Pantallas =====
document.getElementById("enterSetup").addEventListener("click", () => {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("setup-screen").classList.remove("hidden");
});

// ===== Config equipos =====
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
      <img class="preview" id="preview${i}" src="${logos[0]}" alt="preview">
    `;

    teamsConfig.appendChild(row);

    row.querySelector(`#teamImg${i}`).addEventListener("change", e=>{
      row.querySelector(`#preview${i}`).src = e.target.value;
    });
  }
}

// ===== Start juego =====
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

  resetQuestionBag();

  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  currentTeam = 0;
  timeLeft = 900;

  renderTeams();
  updateTurn();
  startTimer();

  showNextQuestion();
});

// ===== Preguntas =====
function resetQuestionBag(){
  questionBag = QUESTIONS.map((_, idx) => idx);
  shuffle(questionBag);
}

function getNextQuestion(){
  if (questionBag.length === 0) resetQuestionBag();
  const idx = questionBag.pop();
  return QUESTIONS[idx];
}

function showNextQuestion(){
  currentQuestion = getNextQuestion();
  answeringLocked = false;

  document.getElementById("feedback").textContent = "";
  document.getElementById("question").textContent = currentQuestion.q;

  const optionsWrap = document.getElementById("options");
  optionsWrap.innerHTML = "";

  const letters = ["A", "B", "C", "D"];

  currentQuestion.o.forEach((optText, optIdx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    btn.dataset.idx = String(optIdx);
    btn.textContent = `${letters[optIdx]}) ${optText}`;
    btn.addEventListener("click", () => chooseOption(optIdx));
    optionsWrap.appendChild(btn);
  });
}

function chooseOption(selectedIdx){
  if (answeringLocked) return;
  answeringLocked = true;

  const correctIdx = currentQuestion.a;
  const letters = ["A", "B", "C", "D"];
  const optionsButtons = Array.from(document.querySelectorAll(".option-btn"));

  optionsButtons.forEach(b => b.disabled = true);

  const correctBtn = optionsButtons.find(b => Number(b.dataset.idx) === correctIdx);
  if (correctBtn) correctBtn.classList.add("correct");

  if (selectedIdx !== correctIdx) {
    const selectedBtn = optionsButtons.find(b => Number(b.dataset.idx) === selectedIdx);
    if (selectedBtn) selectedBtn.classList.add("wrong");
  }

  const ok = selectedIdx === correctIdx;

  if (ok) {
    document.getElementById("feedback").textContent = "✅ ¡Correcto!";
  } else {
    const correctText = currentQuestion.o[correctIdx];
    document.getElementById("feedback").textContent =
      `❌ Incorrecto. La correcta era ${letters[correctIdx]}) ${correctText}`;
  }

  resolveAnswer(ok);

  setTimeout(() => {
    // si ya terminó el juego, no seguimos
    if (!document.getElementById("game-screen").classList.contains("hidden")) {
      showNextQuestion();
    }
  }, 1000);
}

// ===== Recorrido =====
function renderTeams(){
  const track = document.getElementById("teams-track");
  track.innerHTML = "";

  const goal = document.createElement("img");
  goal.src = "images/meta.png";
  goal.className = "goal-icon";
  goal.alt = "Meta";
  goal.style.setProperty("--goal-x", `${maxSteps * stepPx}px`);
  track.appendChild(goal);

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

function resolveAnswer(ok){
  const t = teams[currentTeam];

  if(ok){
    t.position = Math.min(maxSteps, t.position + 1);
    if(t.position >= maxSteps){
      endGame(t.name, false);
      return;
    }
  }else{
    t.position = Math.max(0, t.position - 1);
    currentTeam = (currentTeam + 1) % teams.length;
  }

  renderTeams();
  updateTurn();
}

// ===== Timer =====
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

// ===== Utils =====
function shuffle(arr){
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
