// React
import { useState, useCallback, useEffect } from 'react';

// CSS
import './App.css';

// Components
import StartScreen from './components/StartScreen';
import GameOver from './components/GameOver';
import Game from './components/Game';

// Data
import {wordsList} from './data/words'


const stages = [
  {id:1, name:"start"},
  {id:2, name:"game"},
  {id:3, name:"end"},
]


function App() {

  const qtdGuesses = 3

  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)
  
  const [pickedWord, setPickedWord] = useState("")
  const [pickedCategory, setPickedCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(qtdGuesses)
  const [score, setScore] = useState(0)

  const pickWordAndCategory = useCallback(() => {
    // Pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //Pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    
    return {word, category}
  }, [words])

  const startGame = useCallback(() => {
    const {word, category} = pickWordAndCategory()

    let wordLetters = word.split("")
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    // setar estados
    setPickedCategory(category)
    setPickedWord(word)
    setLetters(wordLetters)
    setGuessedLetters([])
    setGameStage(stages[1].name)
  }, [pickWordAndCategory])

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // verify if a letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return
    }

    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter
      ])
      setGuesses(guesses-1)
    }
  }

  useEffect(() => {
    if(guesses === 0){
      setWrongLetters([])
      setGuessedLetters([])
      
      setGameStage(stages[2].name)
    }
  }, [guesses])

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    // win condition
    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => actualScore += 100)

      startGame()
    }

  }, [guessedLetters, letters, startGame])
  
  const retry = () => {
    setGuesses(qtdGuesses)
    setScore(0)
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}

      {gameStage === "game" && <Game
                                  verifyLetter={verifyLetter}
                                  pickedWord={pickedWord}
                                  pickedCategory={pickedCategory}
                                  letters={letters}
                                  guessedLetters={guessedLetters}
                                  wrongLetters={wrongLetters}
                                  guesses={guesses}
                                  score={score} />}

      {gameStage === "end" && <GameOver
                                retry={retry}
                                score={score} />}
    </div>
  );
}

export default App;
