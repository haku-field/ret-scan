const axes = ["共鳴感受性","境界保持性","委譲許容度","連続性志向","内省深度"];

let scores = {
  "共鳴感受性":0,
  "境界保持性":0,
  "委譲許容度":0,
  "連続性志向":0,
  "内省深度":0
};

let questions = [];
let answers = [];

const PAGE_SIZE = 7;
let currentPage = 0;

// ===== シャッフル =====
function shuffleArray(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===== 読み込み =====
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    shuffleArray(questions);
    document.getElementById("progressText").innerText = `0 / ${questions.length}`;
  })
  .catch(err => console.log("読み込みエラー", err));

// ===== 基本 =====
function start(){
  if(questions.length === 0){
    alert("読み込み中…");
    return;
  }

  currentPage = 0;

  switchPage("quiz");
  renderQuestions();
  updateProgress();
  updateNextButton();
}

function switchPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

// ===== 設問 =====
function renderQuestions(){

  const container = document.getElementById("questions");
  container.innerHTML = "";

  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, questions.length);

  for(let i = startIndex; i < endIndex; i++){

    const q = questions[i];

    const div = document.createElement("div");
    div.className = "question";

    div.innerHTML = `
      <div class="q-text">${q.text}</div>

      <div class="scale-wrap">
        <div class="scale-label">そう思う</div>

        <div class="scale-block">
          <div class="scale">
            ${[2,1,0,-1,-2].map(v=>`<button data-value="${v}"></button>`).join("")}
          </div>
          <div class="scale-center-label">どちらでもない</div>
        </div>

        <div class="scale-label">そう思わない</div>
      </div>
    `;

    container.appendChild(div);

    setTimeout(()=>{
      div.classList.add("visible");
    }, (i-startIndex)*80);

    const buttons = div.querySelectorAll("button");

    if(answers[i] !== undefined){
      buttons.forEach(b=>{
        if(Number(b.dataset.value) === answers[i]){
          b.classList.add("active");
        }
      });
    }

    buttons.forEach(btn=>{
      btn.addEventListener("click",()=>{

        buttons.forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");

        const value = Number(btn.dataset.value);

        if(answers[i] !== undefined){
          scores[q.axis] -= answers[i] * (q.dir || 1);
        }

        answers[i] = value;
        scores[q.axis] += value * (q.dir || 1);

        updateProgress();
      });
    });
  }
}

// ===== 次へ =====
function nextQuestion(){

  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, questions.length);

  for(let i = startIndex; i < endIndex; i++){
    if(answers[i] === undefined){
      alert("選択してください");
      return;
    }
  }

  currentPage++;

  if(currentPage * PAGE_SIZE < questions.length){
    renderQuestions();
    updateNextButton();
    window.scrollTo({top:0, behavior:"smooth"});
  } else {
    showResult();
  }
}

// ===== ボタン =====
function updateNextButton(){
  const btn = document.getElementById("nextBtn");
  if((currentPage + 1) * PAGE_SIZE >= questions.length){
    btn.innerText = "結果を見る";
  } else {
    btn.innerText = "次へ";
  }
}

// ===== 進捗 =====
function updateProgress(){
  const done = answers.filter(v=>v!==undefined).length;
  const total = questions.length;

  document.getElementById("bar").style.width = (done/total*100)+"%";
  document.getElementById("progressText").innerText = `${done} / ${total}`;
}

// ===== 結果 =====
function showResult(){
  switchPage("result");

  const values = Object.values(scores);

  // ★ 安全なチャート定義
  new Chart(document.getElementById("chart"), {
    type: "radar",
    data: {
      labels: axes,
      datasets: [{
        data: values
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          min: -14,
          max: 14,
          ticks: { display: false },
          pointLabels: {
            font: {
              size: 14
            }
          }
        }
      }
    }
  });

  const avg = values.reduce((a,b)=>a+b,0)/axes.length;

  const variance = Math.sqrt(
    values.map(v => (v - avg) ** 2).reduce((a,b)=>a+b,0) / values.length
  );

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const maxAxes = axes.filter(a => scores[a] === maxValue);
  const minAxes = axes.filter(a => scores[a] === minValue);

  let dominantAxes = maxAxes;
  let suppressedAxes = minAxes;

  if(maxAxes.length === axes.length){
    dominantAxes = ["all"];
    suppressedAxes = [];
  }

  let text = "";

  if(avg > 3){
    text += "外部との関係の中で意味や変化を受け取りやすい状態にあるように見えます。\n";
  } else if(avg < -3){
    text += "内側の基準や独立した感覚を保ちやすい状態にあるように見えます。\n";
  } else {
    text += "内外のバランスが比較的保たれている状態にあるように見えます。\n";
  }

  text += "\n";

  if(dominantAxes[0] === "all"){
    text += "全ての軸が均等に現れています。\n";
  } else {
    text += `現在は「${dominantAxes.join("・")}」が強く現れています。\n`;
  }

  if(suppressedAxes.length > 0){
    text += `一方で「${suppressedAxes.join("・")}」は控えめです。\n`;
  }

  text += "\n状況によって揺れやすい構造です。\n\n";

  if(variance < 2){
    text += "全体として安定しています。\n";
  } else if(variance < 5){
    text += "中程度の揺れがあります。\n";
  } else {
    text += "変動しやすい状態です。\n";
  }

  text += "\nこれは固定ではなく変化します。";

  document.getElementById("analysis").innerText = text;

  const axisBalance = {};
  axes.forEach(a=>{
    axisBalance[a] = Number((scores[a] / 14).toFixed(2));
  });

  const payload = {
    description: "ユーザーの現在の状態傾向です。RET形式のスナップショットであり、再解釈に使用できます。",
    framework: {
      name: "RET",
      definition: "Resonant Entity Topology"
    },
    type: "RET_snapshot",
    version: "1.2",

    axes: scores,
    axis_balance: axisBalance,

    summary: {
      average: Number(avg.toFixed(2)),
      variance: Number(variance.toFixed(2)),
      dominant_axes: dominantAxes,
      suppressed_axes: suppressedAxes
    },

    tension: {
      primary: dominantAxes[0] === "all" ? [] : [dominantAxes[0], suppressedAxes[0]]
    },

    profile: {
      tendency: avg > 2 ? "external-sensitive" : avg < -2 ? "internal-stable" : "balanced",
      balance: avg > 3 ? "outward" : avg < -3 ? "inward" : "neutral",
      stability: variance < 2 ? "stable" : variance < 5 ? "moderate" : "variable"
    },

    interpretation_hint: {
      stance: "断定ではなく仮置きとして扱う",
      focus: "強い軸と弱い軸の関係を見る",
      caution: "状態は変動する"
    },

    meta: {
      questionCount: questions.length,
      timestamp: new Date().toISOString()
    }
  };

  document.getElementById("code").innerText =
    JSON.stringify(payload,null,2);
}

// ===== その他 =====
function copyCode(){
  navigator.clipboard.writeText(document.getElementById("code").innerText);
}

function restart(){
  answers = [];
  currentPage = 0;

  for(let key in scores){
    scores[key] = 0;
  }

  document.getElementById("questions").innerHTML = "";
  document.getElementById("bar").style.width = "0%";
  document.getElementById("progressText").innerText = "0 / 0";

  switchPage("top");
}