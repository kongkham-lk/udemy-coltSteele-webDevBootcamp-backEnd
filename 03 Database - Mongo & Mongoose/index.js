const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/movieApp')
  .then(() => {
    console.log("CONNNECTION OPEN!!!");
  })
  .catch(err => {
    console.log("OH NO, ERROR!!!");
    console.log(err);
  });

// create object pattern
const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String
});

// declare class
const Movie = mongoose.model('Movie', movieSchema);

// INSERT 1 DATA -> run constructor and save
const amadeus = new Movie({ title: "Amadeus",  year: 1986, score: 9.2, rating: 'R' });
const Don = new Movie({ title: "Don",  year: 1996, score: 9.8, rating: 'R' });
const Ama = new Movie({ title: "Ama",  year: 1986, score: 9.2, rating: 'R' });
const Pet = new Movie({ title: "Pet",  year: 2000, score: 8.5, rating: 'R' });
const Van = new Movie({ title: "Van",  year: 2006, score: 9.3, rating: 'R' });
const Cat = new Movie({ title: "Cat",  year: 2015, score: 8.2, rating: 'PG-13' });

amadeus.save(); 
Don.save(); 
Ama.save(); 
Pet.save(); 
Van.save(); 
Cat.save(); 

// not common -> TAKES LONG TIME TO COMPLETE
/* Movie.insertMany([
    { title: "Don",  year: 1996, score: 9.8, rating: 'R' },
    { title: "Ama",  year: 1986, score: 9.2, rating: 'R' },
    { title: "Pet",  year: 2000, score: 8.5, rating: 'R' },
    { title: "Van",  year: 2006, score: 9.3, rating: 'R' },
    { title: "Cat",  year: 2015, score: 8.2, rating: 'PG-13' }
])
.then(data => console.log("IT WORKS!!!", data)) */


