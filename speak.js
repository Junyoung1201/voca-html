function speak(text, lang) {
    return new Promise(function (resolve) {
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang || "en-US";
        utterance.onend = resolve;
        window.speechSynthesis.speak(utterance);
    });
}

// 다른 스크립트에서 사용할 수 있도록 export
export { speak };