// Misc utitles
const utils = {
  calcReleaseDate(date) {
    // A function for calc date(yyyy-mm-dd to days ago)
    date = date.split("-");
    date = new Date(date[0], parseInt(date[1] - 1), date[2]);
    const days = Math.floor((new Date() - date) / 86400000);
    return days;
  },
  randomNumberGen(endNumber) {
    const tempCalc = Math.floor(Math.random() * endNumber);
    return tempCalc;
  }
};

export default utils;
