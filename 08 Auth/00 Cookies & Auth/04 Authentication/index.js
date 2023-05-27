const bcrypt = require('bcrypt');

const hashPassword = async (pw) => {
    // bcrypt.genSalt will gen random value for hash algorithm to calculate
    // the bigger the no. pass in, the longer it takes to hash password => min rec 12
    const salt = await bcrypt.genSalt(12);
    const hashPW = await bcrypt.hash(pw, salt);
    console.log(salt);
    console.log(hashPW);
}

// hashPW -> the hashPassword that store in the database
const logicCompare = async (pw, hashPW) => {
    const result = await bcrypt.compare(pw, hashPW);
    if (result) {
        console.log('SUCCESSFULLY LOGGED YOU IN!');
    } else {
        console.log('INCORRECT PASSWORD!')
    }
}