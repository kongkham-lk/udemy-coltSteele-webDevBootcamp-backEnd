const jokes = document.querySelector("#jokes");
const btn = document.querySelector("button");

const addNewJoke = async () => {
    const jokeText = await loadDadJoke();
    const newLi = document.createElement("li");
    newLi.append(jokeText);
    jokes.append(newLi);
}

const loadDadJoke = async () => {
    try {
        // header reuest for each API
        const header = await { headers : { Accept: "application/json" } };
        // insert to the end of the axios.get() parameter
        const res = await axios.get("https://icanhazdadjoke.com/", header);
        return res.data.joke;
    } catch (e) {
        console.log("Sorry, NO JOKE...");
    }
};

// no backet within the addEventListener() parameter
btn.addEventListener("click", addNewJoke);