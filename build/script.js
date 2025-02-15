// Copyright (C) 2023 Bovination Productions, MIT License

import View from './view.js';
import Model from './model.js';
import { getDateNumber } from "./numbers.js";

let view = null;
let model = view;

function initialize() {
    afdCheck();
    view = new View();
    model = new Model(view);
    view.setModel(model);
    model.initialize();
    view.setModelContinue();
    let gameFinished = false;
    model.doneFunc = () => {
        gameFinished = true;
    }
    if (!model.allDone) {
        const keyboard = document.getElementById("keyboard-cont");
        document.addEventListener("keyup", (e) => {
            if (gameFinished) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            if (view) view.keyHandler(e);
            else console.log(`Not handling key ${e.key}`);
        });
        keyboard.addEventListener("click", (e) => {
            if (gameFinished) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            if (!view) {
                console.log(`Not handling click event on ${ e.target.nodeName }`);
            } else if (e.target.nodeName === "BUTTON") {
                const command = e.target.textContent;
                if (command) {
                    e.key = command;
                    view.keyHandler(e);
                } else {
                    console.log(`Clicked button has no textContent`);
                }
            }
            console.log(`Ignoring click on non-button ${ e.target.nodeName }`);
        });
        keyboard.addEventListener('dblclick', (e) => {
            if (gameFinished) {
                e.stopPropagation();
                e.preventDefault();
                return;
            }
            e.stopPropagation();
            e.preventDefault();
        });
        const clearMarkersButton = document.getElementById("clear-markers");
        if (clearMarkersButton) {
            clearMarkersButton.addEventListener("click", (event) => {
                model.clearMarkers(event);
            });
            clearMarkersButton.disabled = true;
        }
        model.clearMarkersButton = clearMarkersButton;
    } else {
        view.showStats();
    }
    // Always set up the stats buttons
    const statsDiv = document.querySelector('div#statistics');
    if (statsDiv) {
        const closeButton = statsDiv.querySelector('div#closeRow button#closeStats');
        closeButton.addEventListener('click', () => {
            statsDiv.classList.add('hidden');
        });
        const shareButton = statsDiv.querySelector('div#closeRow button#shareStats');
        shareButton.addEventListener('click', () => {
            const statsBody = statsDiv.querySelector('div#statsBody');
            if (statsBody) {
                const shareText = statsBody.textContent;
                try {
                    copyTextToClipboard(shareText);
                } catch (e) {
                    console.log(`Trying to share failed: ${err}`);
                }
            }
        });
    }
    const hintsButton = document.querySelector('div#hintsBlock input#toggle-hints');
    if (hintsButton) {
        hintsButton.addEventListener('click', (e) => {
            const button = e.target;
            const checked = button.checked;
            button.labels[0].textContent = `Hints are ${ checked ? 'on' : 'off'}`;
            model.updateHintStatus(checked);
        });
    }
    const showNumLeftButton = document.querySelector('div#hintsBlock input#toggle-num-left');
    if (showNumLeftButton) {
        showNumLeftButton.addEventListener('click', (e) => {
            const button = e.target;
            const checked = button.checked;
            button.labels[0].textContent = `Showing # possibilities is ${ checked ? 'on' : 'off'}`;
            model.updateShowNumLeftStatus(checked);
            view.showOrHideNumLeft(checked);
        });
    }

    document.getElementById('shareResults').addEventListener('click', (e) => {
        const shareText = model.getShareText();
        try {
            copyTextToClipboard(shareText);
        } catch(e) {
            console.log(`Trying to share failed: ${ err }`);
        }
    });
    document.getElementById('theme-select').addEventListener('input', (e) => {
        const themeName = view.changeThemeHandler(e);
        if (themeName) {
            model.changeTheme(themeName);
        }
        e.target.blur();
    });

    view.showTestimonial();
    view.doBlurbs();
}
window.addEventListener('load', () => {
    initialize();
});

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('navigator.clipboard.writeText worked');
    }, function(err) {
        console.error(`navigator.clipboard.writeText failed: ${ e }`);
        fallbackCopyTextToClipboard(text);
    });
}

function alreadyPlayedToday() {
    const saveableState = localStorage.getItem('saveableState');
    if (!saveableState) {
        return false;
    }
    try {
        const state = JSON.parse(saveableState);
        return state.date === getDateNumber();
    } catch(ex) {
        console.log(`QQQ: problem: ${ ex }`);
    }
    return false;
}

function afdCheck() {
    // console.log('in afdCheck ...');
    const date = new Date();
    // if (date.getMonth() !== 11 || date.getDate() !== 19) {
    if (date.getMonth() !== 3 || date.getDate() !== 1) {
        return;
    }
    if (alreadyPlayedToday()) {
        return;
    }
    // console.table(location);
    const searchParams = new URLSearchParams(window.location.search);
    // console.log(`QQQ: has std: ${ searchParams.has('noafj')}`);
    if (searchParams.has('noafj')) {
        return;
    }
    if (location.origin.includes('127.0.0.1')) {
        window.location.href = 'http://bentframe.org/staging/lirdle41';
    }
    const href = window.location.href.toString();
    const newURL = href.replace('lirdle.com', 'lirdle41.com');
    if (href === newURL) {
        return;
    }
    // console.log(`QQQ: - Switch to ${ newURL }`);
    window.location.href = newURL;
    // console.log(`QQQ: + Switch to ${ newURL }`);
}