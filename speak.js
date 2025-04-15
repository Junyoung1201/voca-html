function speak(text, lang) {
    return new Promise(function (resolve) {
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang || "en-US";
        utterance.onend = resolve;
        window.speechSynthesis.speak(utterance);
    });
}

export { speak };