import { speak } from "../speak.js";
import Strings from "../strings.js";
import { loadVocabData } from "../voca.js";

let vocabData = {};
let questionList = [];
let wrongAnswerList = [];
let retry = false;
let retryQuestionList = [];

let currentQuestion = null;
let currentAnswer = null;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const nextBtnEl = document.getElementById("nextBtn");
const exitBtnEl = document.getElementById("exitBtn");

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function setNextButtonVisible(bool) {
    nextBtnEl.style.display = bool ? "inline-block" : "none";
}

function generateQuestion() {
    feedbackEl.textContent = "";
    setNextButtonVisible(false);
    optionsEl.innerHTML = "";

    if (questionList.length === 0) {
        if (!retry && wrongAnswerList.length > 0) {
            // 오답 복습 시작
            retry = true;
            questionList = [...wrongAnswerList];
            wrongAnswerList = [];
            feedbackEl.textContent = Strings.QUIZ_RETRY_START;
            return setTimeout(generateQuestion, 2500);
        }

        if (retry && retryQuestionList.length > 0) {
            // 오답 복습 중 다시 틀린 문제
            questionList = [...retryQuestionList];
            retryQuestionList = [];
            feedbackEl.textContent = Strings.QUIZ_RETRY2_START;
            return setTimeout(generateQuestion, 2500);
        }

        // 모든 복습 끝
        feedbackEl.textContent = Strings.QUIZ_COMPLETE;
        questionEl.textContent = "";
        optionsEl.innerHTML = "";
        setNextButtonVisible(false);
        return;
    }

    const [word, meaning] = questionList.shift();
    currentQuestion = word;
    currentAnswer = meaning;

    const entries = Object.entries(vocabData);
    const wrongChoices = shuffle(
        entries.filter(([w]) => w !== word)
    ).slice(0, 3).map(([_, m]) => m);

    const choices = shuffle([...wrongChoices, meaning]);

    questionEl.textContent = word;
    choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.onclick = () => checkAnswer(choice);
        optionsEl.appendChild(btn);
    });
}

async function checkAnswer(selected) {
    if (selected === currentAnswer) {
        feedbackEl.textContent = Strings.QUIZ_CORRECT;
        feedbackEl.style.color = "green";

        await speak(currentQuestion);
        await speak(currentAnswer, "ko");

        setTimeout(() => {
            generateQuestion();
        }, 300);
    } else {
        feedbackEl.textContent = Strings.QUIZ_INCORRECT.replace("%s",currentAnswer);
        feedbackEl.style.color = "red";

        const wrongEntry = [currentQuestion, currentAnswer];
        if (!retry) {
            wrongAnswerList.push(wrongEntry);
        } else {
            retryQuestionList.push(wrongEntry);
        }

        setNextButtonVisible(true);
    }
}

async function init() {
    let data = await loadVocabData();
    vocabData = data;

    questionList = shuffle(Object.entries(vocabData));
    generateQuestion();
}

document.addEventListener("DOMContentLoaded", init);

nextBtnEl.addEventListener("click", () => {
    generateQuestion();
});

exitBtnEl.addEventListener("click", function () {
    window.location.href = "../index.html";
});