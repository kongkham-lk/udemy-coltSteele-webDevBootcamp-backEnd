const form = document.querySelector("#search");
// need to set as SUBMIT -> (set CLICK - result will auto generate when click)
// can use inputevent, changeevent, or key down instead of submit if wanna a lives search 
//-> BUT might end up making mistake in requesting them too much - e.g. type every single char and show 20 or 100 results
form.addEventListener("submit", async function (e) {
    e.preventDefault();
    // checking how to get the user input -> console.dir(form);
    const searchTerm = form.elements.query.value;
    // TWO WAY OF ADDING END POINT OF QUERY STRING (ADD TEXT AT THE END OF THE LINK)
    // 1. PUT PLACE HOLDER -> LIMITATION
    //=> const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
    // 2. CREATE A QUER STRING OBJECT (MORE FLEXIBLE) -> can insert more that one type query string
    //=> const config = { param : { q: searchTerm, isFunny: 'colt' }, headers : { ... } }
    const config = { param : { q: searchTerm, isFunny: 'colt' } };
    const res = await axios.get(`https://api.tvmaze.com/search/shows`, config);
    makeImage(res.data);
    form.elements.query.value = "";
})

const makeImage = function(shows) {
    for (let result of shows) {
        // sometimes there is no medium (for showing image)
        if (result.show.image) {
            const img = document.createElement("img");
            img.src = result.show.image.medium;
            document.body.append(img);
        }
    }
}