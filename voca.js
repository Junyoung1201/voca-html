import {DEBUG} from './dev.js';

let vocabData = null;

const loadVocabData = () => {
    if (vocabData) return Promise.resolve(vocabData);

    let dataFile = DEBUG ? "data-test.json" : "data.json";

    return fetch(`${window.location.origin}/${dataFile}`)
        .then(res => {
            if (!res.ok) throw new Error("데이터 불러오기 실패");
            return res.json();
        })
        .then(data => {
            vocabData = data;
            return vocabData;
        });
};

export { loadVocabData };