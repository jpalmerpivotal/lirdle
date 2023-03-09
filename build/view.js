// Copyright (C) 2023 Bovination Productions, MIT License

import beep from "./beep.js";
import { devMode, getDateNumber, getYesterdaysWord } from "./numbers.js";

export default function View() {
    this.board = document.getElementById("game-board");
    this.dupWord = document.getElementById("dupWord");
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = NEUTRAL_COLOR;
    }
    this.model = null;
    this.wordIsInvalid = false;
    this.gameFinished = false;
}

function pad(val, minSize, padChar) {
    let s = val.toString();
    while (s.length < minSize) {
        s = padChar + s;
    }
    return s;
}

const COLORS = ['grey', 'yellow', 'green'];
const NEUTRAL_COLOR = 'white';

View.prototype = {
    setModel(model) {
        this.model = model;
    },
    setModelContinue() {
        this.showYesterdaysWord();
        this.initializeTheme(this.model.prefs.theme);
    },
    populateBoardFromSaveableState(numNeededRows, guessWords, scores) {
        this.initBoard(numNeededRows);
        for (let i = 0; i < guessWords.length; i++) {
            for (let j = 0; j < guessWords[i].length; j++) {
                this.model.addColorHit(guessWords[i][j], scores[i][j]);
                this.insertLetter(guessWords[i][j], i, j);
            }
            this.enterScoredGuess(guessWords[i], scores[i], i, false, true);
        }
    },

    handleLetterBoxClick(e) {
        if (this.gameFinished) {
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        const target = e.target;
        if (!target.classList.contains('filled-box')) {
            return;
        }
        if (target.classList.contains('show-lie')) {
            target.classList.remove('show-lie');
            target.classList.add('show-perceived-truth');
        } else if (target.classList.contains('show-perceived-truth')) {
            target.classList.remove('show-perceived-truth');
        } else {
            // We avoid constraints on number of marked letters
            // due to complexity and individual preferences
            const row = target.parentElement;
            target.classList.add('show-lie');
        }
        e.preventDefault();
    },

    appendBoardRow() {
        let row = document.createElement("div");
        row.className = "letter-row";

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            box.addEventListener('click', this.handleLetterBoxClick.bind(this));
            row.appendChild(box);
        }
        this.board.appendChild(row);
        const classNames = ["small1", "small2", "small3", "small4"];
        const classList = this.board.classList;
        const eltCount = this.board.childElementCount;
        classList.remove(...classNames);
        if (eltCount > 24) {
            classList.add("small4");
        } else if (eltCount > 18) {
            classList.add("small3");
        } else if (eltCount > 12) {
            classList.add("small2");
        } else if (eltCount > 6) {
            classList.add("small1");
        }
    },

    showTheWin(guessCount, changes) {
        this.showWinningInfo(guessCount);
        this.showDeceptiveSquares(changes);
        this.showAllDone();
        this.showTodaysStats();
        this.gameFinished = true;
        Array.from(document.querySelectorAll('#keyboard-cont button.keyboard-button')).forEach(elt => {
            elt.setAttribute('disabled', true);
        });
    },

    showWinningInfo(guessCount) {
        const msg = `You got it in ${ guessCount } guess${ guessCount > 1 ? 'es' : ''}!`;
        const result = document.getElementById('result');
        if (!result) {
            console.log(`Can't find result div`);
            setTimeout(() => {
                alert(msg);
            }, 1_000);
            return;
        }
        result.children[0].textContent = msg;
        result.classList.remove('hidden');
        result.classList.add('show');
    },

    showAllDone() {
        const msg = `until next game`;
        const allDone = document.getElementById('alldone');
        if (!allDone) {
            console.log(`Can't find div alldone`);
            setTimeout(() => {
                alert(msg);
            }, 1_000);
            return;
        }
        allDone.children[0].textContent = msg;
        allDone.classList.remove('hidden');
        allDone.classList.add('show');
        const allDoneSpan = allDone.children[0];
        const startDate = getDateNumber();
        const setTimeLeft = () => {
            const thisDate = getDateNumber();
            if (thisDate > startDate) {
                allDoneSpan.textContent = "You can refresh to get a new puzzle";
                return;
            }
            const t1 = new Date();
            const times = [23 - t1.getHours(), pad(59 - t1.getMinutes(), 2, '0'), pad(59 - t1.getSeconds(), 2, '0')];
            allDoneSpan.textContent = `Next puzzle in ${ times.join(":") }`;
            setTimeout(setTimeLeft, 1 * 1000);
        }
        setTimeout(setTimeLeft, 0);
        setTimeout(() => {
            this.showStats()
        }, 1000);
    },
    /**
     * changes: array of [index, actualResult, displayedResult]
     * @param changes
     */
    showDeceptiveSquares(changes) {
        for (let i = 0; i < changes.length; i++) {
            const row = this.board.children[i];
            if (!row) {
                console.log(`showDeceptiveSquares: No row at entry ${ i }`);
                break;
            }
            const change = changes[i];
            const box = row.children[change[0]];
            const actualColor = COLORS[change[1]];
            box.classList.add(`actual${ actualColor }`);
        }
    },

    showStats() {
        const stats = this.model.stats;
        if (stats.totalUnfinishedGames <= 2 && stats.totalFinishedGames <= 2) {
            return;
        }
        const statsDiv = document.getElementById('statistics');
        if (!statsDiv) {
            console.log("Can't find the stats div");
            return;
        }
        const statsBody = statsDiv.querySelector('div#statsBody');
        if (statsBody) {
            statsBody.innerHTML = stats.getStatsSummary();
        }
        statsDiv.classList.remove('hidden');
    },

    changeInvalidWordState(rowNum, wordIsInvalid, guessString) {
        if (this.wordIsInvalid !== wordIsInvalid) {
            if (!this.wordIsInvalid) {
                this.markCurrentWordInvalid(rowNum);
                if (guessString) {
                    this.dupWord.querySelector('#dupWordContents').textContent = guessString;
                    this.dupWord.classList.remove('hidden');
                    this.dupWord.classList.add('show');
                }
            } else {
                this.markCurrentWordValid(rowNum);
                this.dupWord.classList.remove('show');
                this.dupWord.classList.add('hidden');
            }
            this.wordIsInvalid = wordIsInvalid;
        }
    },

    markCurrentWordInvalid(rowNum) {
        const row = this.board.children[rowNum];
        for (let i = 0; i < 5; i++) {
            const box = row.children[i];
            box.classList.add('invalid');
        }
    },

    markCurrentWordValid(rowNum) {
        const row = this.board.children[rowNum];
        for (let i = 0; i < 5; i++) {
            const box = row.children[i];
            box.classList.remove('invalid');
        }
    },

    initBoard(numNeededRows) {
        for (let i = this.board.childElementCount; i < numNeededRows; i++) {
            this.appendBoardRow();
        }
    },

    clearBoard() {
        if (!this.board) {
            console.log("No board in clearBoard!");
            return;
        }
        while (this.board.childElementCount) {
            this.board.removeChild(this.board.lastChild);
        }
        for (const elem of document.getElementsByClassName("keyboard-button")) {
            elem.style.backgroundColor = 'white';
        }
    },

    enterScoredGuess(currentGuess, scores, guessCount, guessedIt, immediate) {
        const row = document.getElementsByClassName("letter-row")[guessCount];
        const limit = 5;
        const enterScoredGuessForEntry = (i) => {
            if (i >= limit) {
                return;
            }
            const box = row.children[i];
            const letter = currentGuess[i]; // array or string
            const letterColor = COLORS[scores[i]];
            box.classList.add(`background-${ letterColor }`)
            this.shadeKeyboard(letter, letterColor, guessedIt, this.model.scoresByLetter[letter]);
            if (immediate) {
                enterScoredGuessForEntry(i + 1);
            } else {
                setTimeout(enterScoredGuessForEntry, 100, i + 1);
            }
        };
        enterScoredGuessForEntry(0);
    },

    deleteLetter(rowNum, colNum) {
        let row = document.getElementsByClassName("letter-row")[rowNum];
        let box = row.children[colNum];
        box.textContent = "";
        box.classList.remove("filled-box", "show-lie", "show-perceived-truth");
    },

    insertLetter(pressedKey, rowNum, colNum) {
        pressedKey = pressedKey.toLowerCase();

        let row = document.getElementsByClassName("letter-row")[rowNum];
        let box = row.children[colNum];
        box.textContent = pressedKey;
        box.classList.add("filled-box");
    },

    shadeKeyboard(letter, color, guessIt, numHitsForEachScore) {
        for (const elem of document.getElementsByClassName("keyboard-button")) {
            if (elem.textContent === letter) {
                if (guessIt) {
                    elem.style.backgroundColor = color;
                } else if (numHitsForEachScore[2]) {
                    //TODO: Gradient these
                    elem.style.backgroundColor = "var(--green)";
                } else if (numHitsForEachScore[1]) {
                    elem.style.backgroundColor = "var(--yellow)";
                } else if (numHitsForEachScore[0]) {
                    elem.style.backgroundColor = "#bdd5ea";
                }
                break;
            }
        }
    },


    keyHandler(e) {
        // console.log('>> keyup');
        const pressedKey = String(e.key);
        if (pressedKey === "Backspace" || pressedKey === "Del") {
            if (this.model.nextLetterPosition!== 0) {
                this.model.deleteLetter();
            } else {
                beep();
            }
        } else if (pressedKey.toLowerCase() === "enter") {
            // console.log(`pressed enter, currentTarget: ${e.currentTarget}, target: ${e.target}`);
            e.stopPropagation();
            e.cancelBubble = true;
            if (this.wordIsInvalid) {
                beep();
                return;
            }
            this.model.checkGuess();
        } else if (pressedKey.match(/^[a-z]$/i)) {
            if (this.model.nextLetterPosition === 5) {
                beep();
            } else {
                this.model.insertLetter(pressedKey);
            }
        } else {
            console.log(`Lirdle: ignoring key event ${pressedKey}`);
        }
    },
    showYesterdaysWord() {
        if (!devMode()) {
            const yesterdaysWord = getYesterdaysWord();
            const yesterdaysWordElt = document.getElementById('yesterdaysWord');
            const answerStatsElt = yesterdaysWordElt.querySelector('span#answerStats');
            if (!answerStatsElt) {
                return;
            }
            yesterdaysWordElt.querySelector('span#theAnswer').textContent = yesterdaysWord;
            yesterdaysWordElt.classList.remove('hidden');
            yesterdaysWordElt.classList.add('show');
            // TODO: treat Feb 18/23 as 0 and drop all uses of the 8-digit num except to calc the position
            const currentDateNumber = getDateNumber() - 20230218 - 1;
            let failureCount = 0;
            let intervalPID = 0;
            const fetchFunc = () => {
                fetch(`stats/day${pad(currentDateNumber, 4, '0')}.json`).then((response) => {
                    return response.json();
                }).then((data) => {
                    const fractionFinished = (data.finished * 1.0) / data.started;
                    const fractionFinishedDisplay = Math.round(100 * fractionFinished);
                    const avgTriesDisplay = Math.round(100 * data.finishedDetails.average) / 100.0;
                    answerStatsElt.textContent = ` (${fractionFinishedDisplay}% finished, avg tries: ${avgTriesDisplay})`;
                }).catch((err) => {
                    console.log(`Error fetching - ${err}`);
                    failureCount += 1;
                    if (failureCount > 10) {
                        clearInterval(intervalPID);
                    }
                });
            };
            fetchFunc();
            intervalPID = setInterval(fetchFunc, 10 * 60_000);
        }
    },
    showTodaysStats() {
        let numTriesNeededHere = this.model.saveableState.guessWords.length ?? 0;
        const todaysStatsElt = document.getElementById('todaysStats');
        const todaysPctFinishedSoFarElt = todaysStatsElt.querySelector('span#todaysPctFinishedSoFar');
        const todaysAvgSoFarElt = todaysStatsElt.querySelector('span#todaysAvgSoFar');
        let needToRevealTodaysElt = true;
        // TODO: treat Feb 18/23 as 0 and drop all uses of the 8-digit num except to calc the position
        const currentDateNumber = getDateNumber() - 20230218;
        let failureCount = 0;
        let intervalPID = 0;
        if (numTriesNeededHere === 0) {
            return;
        }
        const fetchFunc = () => {
            fetch(`stats/day${pad(currentDateNumber, 4, '0')}.json`)
            .then((response) => {
                return response.json();
            }).then((data) => {
                if (data.finished === 0) {
                    // We've got an early finisher, so assume their result hasn't been picked up yet.
                    data.finished += 1;
                    data.started += 1;
                    data.finishedDetails = {average: numTriesNeededHere};
                }
                const fractionFinished = (data.finished * 1.0) / data.started;
                const fractionFinishedDisplay = Math.round(100 * fractionFinished);
                const avgTriesDisplay = Math.round(100 * data.finishedDetails.average) / 100.0;
                todaysPctFinishedSoFarElt.textContent = fractionFinishedDisplay.toString();
                todaysAvgSoFarElt.textContent = avgTriesDisplay.toString();
                if (needToRevealTodaysElt) {
                    todaysStatsElt.classList.remove('hidden');
                    todaysStatsElt.classList.add('show');
                    needToRevealTodaysElt = false;
                }
            }).catch((err) => {
                console.log(`Error fetching - ${err}`);
                failureCount += 1;
                if (failureCount > 10) {
                    clearInterval(intervalPID);
                }
            });
	    };
        fetchFunc();
        intervalPID = setInterval(fetchFunc, 1 * 60_000);
    },
    doBlurbs() {
        const useragent = navigator.userAgent.toLowerCase();
        const vendor = navigator.vendor;
        const blacklist = [
            /\bipad\b/,
            /\biphone os\b/,
            /\bsamsung.*mobile safari\b/,
        ];
        if (blacklist.some(t => t.test(useragent))) {
            // do nothing
        } else if (useragent.match(/\bmozilla\b.*\bfirefox\b/)) {
            const div = document.querySelector('div#promos div.for-firefox');
            if (div) {
                div.classList.remove('hidden');
            }
        } else if (vendor.startsWith('Google') && useragent.match(/\bmozilla\b.*\bchrome\b/)) {
            const div = document.querySelector('div#promos div.for-chrome');
            if (div) {
                div.classList.remove('hidden');
            }
        }
    },
    initializeTheme(theme) {
        document.querySelector('#theme-select').value = theme;
        if (theme != 'classic') {
            this.changeTheme(theme);
        }
    },
    changeThemeHandler(e) {
        const value = e.target.value;
        if (!['classic', 'dark', 'pink'].includes(value)) {
            console.log(`Can't process theme ${ value }`);
            return;
        }
        this.changeTheme(value);
        return value;
    },
    changeTheme(theme) {
        const elts = Array.from(document.querySelectorAll('link.theme')).
        filter(elt => elt.classList.contains('theme'));
        for (const elt of elts) {
            if (elt.getAttribute('href') !== `${ theme }.css`) {
                elt.parentElement.removeChild(elt);
            }
        }
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
            "beforeend",
            `<link rel="stylesheet" class="theme" href="${ theme }.css" />`);
    }
}
