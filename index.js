import { loadVocabData } from "./voca.js";
import { speak } from "./speak.js";

const vocaListEl = document.querySelector("#vocaList");
const searchInputEl = document.querySelector("#searchInput")
const startQuizBtnEl = document.querySelector("#startQuizBtn");

function createWordItem(entry) {
    var word = entry[0];
    var meaning = entry[1];

    var div = document.createElement("div");
    div.className = "word-item";
    div.innerHTML =
        '<div class="word">' + word + '</div>' +
        '<div class="meaning">' + meaning + '</div>';

    div.addEventListener("click", function () {
        speak(word, "en-US")
            .then(function () {
                return speak(meaning, "ko-KR");
            });
    });

    return div;
}

function filterEntries(data, query) {
    var lowerQuery = query.toLowerCase();
    return Object.entries(data).filter(function (entry) {
        return entry[0].toLowerCase().includes(lowerQuery);
    });
}

function renderVocaList(data, filter) {
    vocaListEl.innerHTML = "";

    var entries = filterEntries(data, filter || "");
    entries.forEach(function (entry) {
        var element = createWordItem(entry);
        vocaListEl.appendChild(element);
    });
}

async function init() {

    // data.json 불러오기
    let data = await loadVocabData()
    renderVocaList(data);

}

document.addEventListener("DOMContentLoaded", init);

// 퀴즈 버튼 
startQuizBtnEl.addEventListener("click", function () {
    window.location.href = "./quiz/quiz.html";
});

// 단어 검색
searchInputEl.addEventListener("input", function (e) {
    renderVocaList(data, e.target.value);
});