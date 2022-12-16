module.exports = {
    description: 'ask the omnipotent mastermind for his knowledge',
    expectedArgs: '<question>',
    minArgs: 1,
    category: 'Misc.',
    callback: ({ message }) => {
        const random = Math.floor(Math.random() * 20)
        var answers = [
            'Absolut, so wie die Authorität unserer Göttin!',
            'Unterschätze es nicht, genauso wie Roberts sexual frustration',
            'Ich zedaz so',
            'Ohne Zweifel',
            'Definitiv, Alter',
            'Microsoft Outlook gut',
            'Das Sternzeichen von Yeesh leuchtet heute stark dafür',
            'Mit "Support-Desk am Freitagabend" - Wahrscheinlichkeit',
            'Ist die Nase von Julius wunderschön und lang?',
            'So wahr wie Laviis Zeichnkünste',
            'nein...ja... vielleicht?',
            'Frag mich nachher nochmal',
            'Die Kalkulationen sind leicht off, ich aber nicht ;)',
            'Ich sag es dir ein ander Mal',
            'Ohne schwere Zeiten, würden wir die guten Zeiten nie schätzen',
            'Genauso schlecht wie eine Ketzerei gegen den Olymp',
            'Hat der Fuchs uns jemals verraten?...**hust**',
            'Mein Outlook ist abgeschmiert, mist',
            'Ich bezweifle es. A propos, zweifel nicht an den Götter und ihren Priester!',
            'Meine Quellen sagen.... WARNUNG! Artikel 17: Die betroffene Person hat das Recht, von dem Verantwortlichen zu verlangen, dass sie betreffende personenbezogene Daten unverzüglich gelöscht werden, und der Verantwortliche ist verpflichtet, personenbezogene Daten unverzüglich zu löschen, sofern einer der folgenden Gründe zutrifft **ERROR ERROR ERROR**?'
        ]
        return message.channel.send(answers[random])
    }
}