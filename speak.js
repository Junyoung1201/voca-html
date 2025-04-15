function speak(text, lang) {

    text = text.replaceAll("~","").replaceAll("(","").replaceAll(")",".");
    
    return new Promise(function (resolve) {
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang || "en-US";
        utterance.onend = resolve;
        window.speechSynthesis.speak(utterance);
    });
}

export { speak };