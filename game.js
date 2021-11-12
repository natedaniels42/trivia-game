const form = document.getElementById('form');
const gameBoard = document.getElementById('game-board');
const scoreNum = document.getElementById('score');
const questionNum = document.getElementById('question-number');
const questionText = document.getElementById('question');
const answersText = document.getElementById('answers');
const next = document.getElementById('next');
const gameOver = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');

let index = 1;
let score = 0;

const shuffler = () => {
    const indexArr = [];
   
    while (indexArr.length < 4) {
      const randomIndex = Math.floor(Math.random() * 4);
      
      if (!indexArr.includes(randomIndex)) {
          indexArr.push(randomIndex);
      }
    }
    return indexArr;
}

const question = async (currentQuestion) => {
    const answers = currentQuestion.incorrect_answers
        .concat(currentQuestion.correct_answer)
    const indexArr = shuffler();
    const answerObj = {
        'a': answers[indexArr[0]],
        'b': answers[indexArr[1]],
        'c': answers[indexArr[2]],
        'd': answers[indexArr[3]]
    };
    return answerObj;
} 

const formListener = async(event) => {
    event.preventDefault();

    let questions;
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    await fetch(`https://opentdb.com/api.php?amount=5&category=${data.category}&difficulty=${data.difficulty}&type=multiple`)
        .then((response) => response.json())
        .then((response) => questions = response.results);

    playGame(questions);
}

const liListener = (event) => {
    const answerBool = checkAnswer(answers, currentQuestion);

    if (answerBool) {
        event.target.style.backgroundColor = 'lightgreen';
        score++;
    } else {
        const correctKey = Object.keys(answers).find(key => answers[key] === currentQuestion.correct_answer);
        console.log(correctKey);
        document.getElementById(correctKey).style.backgroundColor = 'red';
    }
    index++;
    next.style.visibility = 'visible';
    next.addEventListener('click', () => {
        while (answersText.firstChild) {
            answersText.removeChild(answersText.firstChild);
        }
        playGame(questions);
    })
}

const nextListener = () => {
    while (answersText.firstChild) {
        answersText.removeChild(answersText.firstChild);
    }
    li.removeEventListener('click', liListener);
    playGame(questions);
}


gameOver.addEventListener('click', () => {
    index = 1;
    score = 0;
    form.style.visibility = 'visible';
    gameOver.style.visibility = 'hidden';
})

form.addEventListener('submit', formListener)

const checkAnswer = (answers, current) => {
    return answers[event.target.id] === current.correct_answer;
}

const playGame = async (questions) => {
    gameBoard.style.visibility = 'visible';
    form.style.visibility = 'hidden';
    next.style.visibility = 'hidden';
    gameOver.style.visibility = 'hidden';

    scoreNum.innerHTML = score;
    questionNum.innerHTML = index;

    if (index < 6) {
        const currentQuestion = questions[index - 1];
        console.log(questions);
        const answers = await question(currentQuestion);
        
        questionText.innerHTML = currentQuestion.question;
        for (let [key, value] of Object.entries(answers)) {
            const li = document.createElement('li');
            li.innerHTML = `<p id="${key}">${key}. ${value}</p>`;
            answersText.appendChild(li);
            li.addEventListener('click', (event) => {
                const answerBool = checkAnswer(answers, currentQuestion);

                if (answerBool) {
                    event.target.style.backgroundColor = 'lightgreen';
                    score++;
                } else {
                    const correctKey = Object.keys(answers).find(key => answers[key] === currentQuestion.correct_answer);
                    console.log(correctKey);
                    document.getElementById(correctKey).style.backgroundColor = 'red';
                }
                index++;
                next.style.visibility = 'visible';
                next.addEventListener('click', () => {
                    while (answersText.firstChild) {
                        answersText.removeChild(answersText.firstChild);
                    }
                    next.removeEventListener('click', nextListener);
                    playGame(questions);
                })
            })
        }
    } else {
        gameOver.style.visibility = 'visible';
        gameBoard.style.visibility = 'hidden';
        finalScore.innerHTML = score;
    }
}


   



