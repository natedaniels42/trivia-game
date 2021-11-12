// const axios = require('axios');
const choice = document.getElementById('choice');
const joke = document.getElementById('joke');
const form = document.getElementById('form')

form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(choice.value);
    fetch(`https://v2.jokeapi.dev/joke/${choice.value}?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single`)
        .then((response) => response.json())
        .then((response) => joke.innerHTML = response.joke)
})
