import * as solver from '../build/solver.js';
import {evalPossibleWords, evaluateGuess, getSolverData, isPossibleWord, scoreMakesSense} from "../build/solver.js";
import {WORDS} from "../build/words";

describe('solver tests', () => {
    describe('evaluate guess', () => {
        test('can handle duplicate letters', () => {
            expect(evaluateGuess('abhor', 'parer')).toEqual([0, 1, 0, 0, 2]);
            expect(evaluateGuess('mamma', 'amima')).toEqual([1, 1, 0, 2, 2]);
        })
    })
    describe('reduced word list', () => {
        const currentWordList = ['taste', 'waste', 'wedge', 'llama', 'mango'];
        describe('isPossibleWord', () => {
            test('all green', () => {
                expect(solver.isPossibleWord('green'.split(''), [2,2,2,2,2], 'green')).toBeTruthy();
                expect(solver.isPossibleWord('green'.split(''), [2,2,2,2,2], 'greed')).toBeFalsy();
            });
            test('all black', () => {
                expect(solver.isPossibleWord('abcde'.split(''), [0,0,0,0,0], 'fghij')).toBeTruthy();
                expect(solver.isPossibleWord('abcde'.split(''), [0,0,0,0,0], 'fghie')).toBeFalsy();
            });
            test('all yellow', () => {
                expect(solver.isPossibleWord('abcde'.split(''), [1,1,1,1,1], 'cdeab')).toBeTruthy();
                expect(solver.isPossibleWord('abcde'.split(''), [1,1,1,1,1], 'cdeag')).toBeFalsy();
            });
            test('green and black', () => {
                expect(solver.isPossibleWord('abcde'.split(''), [2,0,2,0,2], 'axcxe')).toBeTruthy();
                expect(solver.isPossibleWord('abcde'.split(''), [2,0,2,0,2], 'abcxe')).toBeFalsy();
                expect(solver.isPossibleWord('abcde'.split(''), [2,0,2,0,2], 'yxcxe')).toBeFalsy();
            });
            test('yellow and black', () => {
                expect(solver.isPossibleWord('abcde'.split(''), [1,0,1,0,1], 'cxexa')).toBeTruthy();
                expect(solver.isPossibleWord('abcde'.split(''), [1,0,1,0,1], 'axexc')).toBeFalsy();
                expect(solver.isPossibleWord('aacde'.split(''), [1,0,0,0,0], 'mnoap')).toBeTruthy();
                expect(solver.isPossibleWord('abcde'.split(''), [1,0,1,0,1], 'ebaxc')).toBeFalsy();
                expect(solver.isPossibleWord('aacde'.split(''), [0,1,0,0,0], 'mnoap')).toBeTruthy();
            });
            test('green and yellow', () => {
                expect(solver.isPossibleWord('abcde'.split(''), [2,1,2,1,2], 'adcbe')).toBeTruthy();
                expect(solver.isPossibleWord('abcde'.split(''), [2,1,2,1,2], 'abcxe')).toBeFalsy();
                expect(solver.isPossibleWord('abcde'.split(''), [2,1,2,1,2], 'axcye')).toBeFalsy();
            });
            test('all three colors', () => {
                expect(solver.isPossibleWord('abcde'.split(''), [0, 2, 1, 1, 0], 'xbdcy')).toBeTruthy();
                expect(solver.isPossibleWord('abcde'.split(''), [0, 2, 1, 1, 0], 'abdcy')).toBeFalsy();
                expect(solver.isPossibleWord('abcde'.split(''), [0, 2, 1, 1, 0], 'xcdby')).toBeFalsy();
                expect(solver.isPossibleWord('abcde'.split(''), [0, 2, 1, 1, 0], 'xbfdc')).toBeFalsy();
            });
            test('scenario', () => {
                expect(solver.isPossibleWord('basue'.split(''), [0,2,2,0,2], 'waste')).toBeTruthy();
            });
        });
        describe('evalPossibleWords', () => {
            test('green i should fail', () => {
                expect(solver.evalPossibleWords('rinse', [1, 2, 1, 1, 0], currentWordList)).toEqual([]);
            });
            test('s, e are green but the a is black', () => {
                let words = solver.evalPossibleWords('basge', [0, 0, 2, 0, 2], currentWordList);
                expect(words).toEqual(['taste', 'waste']);
                words = solver.evalPossibleWords('basue', [0, 0, 2, 0, 2], currentWordList);
                expect(words).toEqual(['taste', 'waste', 'wedge']);
            });
            test('only an l and an m', () => {
                let words = solver.evalPossibleWords('xmgle', [0, 1, 1, 1, 0], currentWordList);
                expect(words).toEqual(['llama', 'mango']);
            });
        });
        describe('updateSolver', () => {
            const solverData = getSolverData();
            const guesses = [];
            const scores = [];
            solverData.possibleWords = currentWordList;
            test('follow through 4 lines', () => {
                solver.updateSolver(guesses,scores, solverData);
                expect(solverData.level).toBe(0);
                expect(solverData).toEqual({
                    level: 0,
                    possibleWords: currentWordList,
                    possibleWordCounts: [],
                });
                // ['taste', 'waste', 'wedge', 'llama', 'mango'];

                guesses.push('quick');
                scores.push([2, 0, 0, 0, 0]);
                solver.updateSolver(guesses,scores, solverData);
                expect(solverData).toEqual({
                    level: 1,
                    possibleWords: currentWordList,
                    possibleWordCounts: [currentWordList.length],
                });
                expect(solverData.level).toBe(1);
                expect(solverData.possibleWords.length).toBe(currentWordList.length);

                guesses.push('fixqa');
                scores.push([0, 0, 0, 0, 0]);
                solver.updateSolver(guesses,scores, solverData);
                expect(solverData).toEqual({
                    level: 2,
                    possibleWords: ['taste', 'waste', 'llama', 'mango'],
                    possibleWordCounts: [5, 4],
                });

                guesses.push('abmdc');
                scores.push([0, 0, 1, 0, 0]);
                solver.updateSolver(guesses,scores, solverData);
                expect(solverData).toEqual({
                    level: 3,
                    possibleWords: ['llama', 'mango'],
                    possibleWordCounts: [5, 4, 2],
                });

                guesses.push('alarm');
                scores.push([1, 1, 2, 0, 1]);
                solver.updateSolver(guesses,scores, solverData);
                expect(solverData).toEqual({
                    level: 4,
                    possibleWords: ['llama'],
                    possibleWordCounts: [5, 4, 2, 1],
                });
            });
        });
    });
    describe('smaller word list', () => {
        const currentWordList = ['abhor', 'urban'];
        describe('abhor/parer bug', () => {
            test('abhor parer test 1', () => {
                const scores = evaluateGuess('abhor', 'parer');
                expect(scores).toEqual([0, 1, 0, 0, 2]);
                const wordList2 = evalPossibleWords('parer', [0, 0, 1, 0, 0], currentWordList)
                expect(wordList2).toEqual(['urban']);
            });
            it('loops through', () => {
                const scores = [0, 1, 1, 0, 0];
                console.log(`-scoreMakesSense 'parer', 'abhor', ${scores.join(',')}, }`);
                expect(scoreMakesSense('parer', 'abhor', scores)).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,0,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,0,1])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,0,2])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,1,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,1,1])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,1,2])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,2,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,2,1])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,2,2])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,0,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,1,0,0,0])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [0,2,0,0,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,1,0,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,1,1,0,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,2,1,0,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,2,0,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,1,2,0,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,2,2,0,0])).toBeFalsy();
                expect(scoreMakesSense('parer', 'abhor', [0,1,0,0,2])).toBeFalsy();
                // Now the only possible truthers
                expect(scoreMakesSense('parer', 'abhor', [0,1,0,0,0])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [0,1,0,0,1])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [0,1,0,1,2])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [0,1,0,2,2])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [0,1,1,0,2])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [0,1,2,0,2])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [0,0,0,0,2])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [0,2,0,0,2])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [1,1,0,0,2])).toBeTruthy();
                expect(scoreMakesSense('parer', 'abhor', [2,1,0,0,2])).toBeTruthy();
            })
        });
    });
    describe('full word list', () => {
        const currentWordList = WORDS.concat([]);
        describe('how many for grape', () => {
            it('finds matches for grape', () => {
                const wordList2 = evalPossibleWords('grape', [2, 2, 2, 2, 2], currentWordList)
                expect(wordList2).toEqual(['drape', 'grace', 'grade', 'graph', 'grate', 'grave', 'graze', 'gripe', 'grope']);
            });
        });
    });
});