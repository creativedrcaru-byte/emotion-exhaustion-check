const labels = [
  "매우 그렇다",
  "자주 그렇다",
  "가끔 그렇다",
  "아주 조금 그렇다",
  "해당 없음"
];

const questions = [
  {
    id: 1,
    text: "최근에 우울하다는 생각을 한다",
    scores: [8, 7, 6, 5, 0]
  },
  {
    id: 2,
    text: "나는 자살 충동을 느낀다",
    scores: [10, 9, 8, 7, 0]
  },
  {
    id: 3,
    text: "어떤 일을 할 때 불안하여 일이 손에 잡히지 않는다",
    scores: [7, 6, 5, 4, 0]
  },
  {
    id: 4,
    text: "최근에 깊은 생각이나 사고를 하지 않는다",
    scores: [4, 3, 2, 1, 0]
  },
  {
    id: 5,
    text: "예전에 비해 요즘은 업무 실행 능력이 감소되었다고 느낀다",
    scores: [6, 5, 4, 3, 0]
  },
  {
    id: 6,
    text: "어떤 한 가지 일에 집중하는 것이 어렵다",
    scores: [5, 4, 3, 2, 0]
  },
  {
    id: 7,
    text: "하지 않으려고 노력하는데도 결근이나 지각을 한다",
    scores: [8, 7, 6, 5, 0]
  },
  {
    id: 8,
    text: "사소한 실수가 이전보다 많다",
    scores: [4, 3, 2, 1, 0]
  },
  {
    id: 9,
    text: "새로운 것을 배울 때 이해력이 부족하다고 느낀다",
    scores: [6, 5, 4, 3, 0]
  },
  {
    id: 10,
    text: "최근에 일어난 일에 대해 기억력이 감퇴되었다고 느낀다",
    scores: [6, 5, 4, 3, 0]
  },
  {
    id: 11,
    text: "잠이 얕고 도중에 잠이 깰 때가 있다",
    scores: [9, 8, 7, 6, 0]
  },
  {
    id: 12,
    text: "식욕이 많이 변했다(식욕감퇴 또는 폭식)",
    scores: [7, 6, 5, 4, 0]
  },
  {
    id: 13,
    text: "매사에 집중하지 못한다",
    scores: [5, 4, 3, 2, 0]
  },
  {
    id: 14,
    text: "교통이 정체되거나 은행, 슈퍼마켓 등에서 오래 기다릴 때 심장이 뛰고 숨이 가빠지는 경험을 한다",
    scores: [8, 7, 6, 5, 0]
  },
  {
    id: 15,
    text: "엘리베이터가 한 층 위에 오래 섰을 때 문을 두드리거나 불평을 한다",
    scores: [7, 6, 5, 4, 0]
  }
];

const state = {
  currentIndex: 0,
  answers: Array(questions.length).fill(null)
};

const startScreen = document.querySelector("#start-screen");
const questionScreen = document.querySelector("#question-screen");
const resultScreen = document.querySelector("#result-screen");
const startButton = document.querySelector("#start-button");
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const restartButton = document.querySelector("#restart-button");
const copyButton = document.querySelector("#copy-button");
const progressCount = document.querySelector("#progress-count");
const progressFill = document.querySelector("#progress-fill");
const questionNumber = document.querySelector("#question-number");
const questionText = document.querySelector("#question-text");
const optionsList = document.querySelector("#options-list");
const message = document.querySelector("#message");
const copyMessage = document.querySelector("#copy-message");
const resultBadge = document.querySelector("#result-badge");
const resultScore = document.querySelector("#result-score");
const resultJudgement = document.querySelector("#result-judgement");
const resultAction = document.querySelector("#result-action");
const resultDescription = document.querySelector("#result-description");

function showScreen(screen) {
  [startScreen, questionScreen, resultScreen].forEach((item) => {
    item.classList.toggle("active", item === screen);
  });
}

function renderQuestion() {
  const currentQuestion = questions[state.currentIndex];
  const progress = ((state.currentIndex + 1) / questions.length) * 100;

  progressCount.textContent = `${state.currentIndex + 1} / ${questions.length}`;
  progressFill.style.width = `${progress}%`;
  questionNumber.textContent = `문항 ${currentQuestion.id}`;
  questionText.textContent = currentQuestion.text;
  message.textContent = "";
  prevButton.disabled = state.currentIndex === 0;
  nextButton.textContent = state.currentIndex === questions.length - 1 ? "결과 보기" : "다음";

  optionsList.innerHTML = "";
  labels.forEach((label, index) => {
    const optionId = `question-${currentQuestion.id}-option-${index}`;
    const option = document.createElement("label");
    option.className = "option-card";
    option.setAttribute("for", optionId);
    option.innerHTML = `
      <input id="${optionId}" type="radio" name="answer" value="${index}">
      <span>${label}</span>
    `;

    const input = option.querySelector("input");
    input.checked = state.answers[state.currentIndex] === index;
    input.addEventListener("change", () => {
      state.answers[state.currentIndex] = index;
      message.textContent = "";
    });

    optionsList.appendChild(option);
  });
}

function calculateTotalScore(answers) {
  return answers.reduce((total, answerIndex, questionIndex) => {
    if (answerIndex === null) {
      return total;
    }

    return total + questions[questionIndex].scores[answerIndex];
  }, 0);
}

function getResult(totalScore) {
  if (totalScore === 0 || totalScore >= 71) {
    return {
      tone: "danger",
      judgement: "감정소모도 위험",
      action: "필요 시 전문의 또는 전문상담사의 도움이 필요하며 개인 스스로의 개선이 어려운 상태",
      description: "감정 소모가 높은 수준으로 나타난 상태입니다. 혼자 견디기보다 전문가 상담, 의료기관 방문, 신뢰할 수 있는 사람과의 상의가 필요합니다."
    };
  }

  if (totalScore <= 21) {
    return {
      tone: "good",
      judgement: "감정소모도 양호",
      action: "현재 상태 수준으로 유지 관리",
      description: "현재는 감정 소모가 비교적 낮은 상태입니다. 지금의 생활 리듬과 회복 습관을 유지하는 것이 좋습니다."
    };
  }

  if (totalScore <= 55) {
    return {
      tone: "normal",
      judgement: "감정소모도 보통",
      action: "적절한 관리를 통해 개선 요구",
      description: "감정 소모가 누적되기 시작한 상태일 수 있습니다. 수면, 휴식, 업무량, 대인관계 스트레스를 점검해보는 것이 좋습니다."
    };
  }

  return {
    tone: "caution",
    judgement: "감정소모도 주의",
    action: "집중 관리를 통해 반드시 개선 필요",
    description: "정서적 피로, 집중력 저하, 불안, 수면 변화 등이 일상 기능에 영향을 줄 수 있는 상태입니다. 생활 패턴과 스트레스 요인을 구체적으로 점검해야 합니다."
  };
}

function renderResult() {
  const totalScore = calculateTotalScore(state.answers);
  const result = getResult(totalScore);

  resultBadge.className = `result-badge tone-${result.tone}`;
  resultBadge.textContent = result.judgement;
  resultScore.textContent = `${totalScore}점`;
  resultJudgement.textContent = result.judgement;
  resultAction.textContent = result.action;
  resultDescription.textContent = result.description;
  copyMessage.textContent = "";
  showScreen(resultScreen);
}

function resetAssessment() {
  state.currentIndex = 0;
  state.answers = Array(questions.length).fill(null);
  renderQuestion();
  showScreen(startScreen);
}

function goToNext() {
  if (state.answers[state.currentIndex] === null) {
    message.textContent = "선택지를 골라주세요";
    return;
  }

  if (state.currentIndex === questions.length - 1) {
    renderResult();
    return;
  }

  state.currentIndex += 1;
  renderQuestion();
}

function goToPrevious() {
  if (state.currentIndex === 0) {
    return;
  }

  state.currentIndex -= 1;
  renderQuestion();
}

async function copyShareText() {
  const totalScore = calculateTotalScore(state.answers);
  const result = getResult(totalScore);
  const shareText = `감정소모 자가진단 결과: ${totalScore}점, ${result.judgement}`;

  try {
    await navigator.clipboard.writeText(shareText);
    copyMessage.textContent = "공유 문구가 복사되었습니다";
  } catch (error) {
    copyMessage.textContent = "복사 기능을 사용할 수 없습니다";
  }
}

// 내부 검증용입니다. 사용자 화면에는 계산 과정이나 문항별 점수를 표시하지 않습니다.
function runInternalChecks() {
  const sampleAnswers = [2, 4, 3, 3, 4, 3, 4, 2, 4, 4, 4, 4, 3, 4, 4];
  const sampleScore = calculateTotalScore(sampleAnswers);
  const sampleResult = getResult(sampleScore);

  console.assert(sampleScore === 17, "예시 총점은 17점이어야 합니다.");
  console.assert(sampleResult.judgement === "감정소모도 양호", "17점은 양호 판정이어야 합니다.");
}

startButton.addEventListener("click", () => {
  renderQuestion();
  showScreen(questionScreen);
});

nextButton.addEventListener("click", goToNext);
prevButton.addEventListener("click", goToPrevious);
restartButton.addEventListener("click", resetAssessment);
copyButton.addEventListener("click", copyShareText);

runInternalChecks();
