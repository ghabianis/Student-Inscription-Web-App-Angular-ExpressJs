const db = require('../util/database');

module.exports = class Absence {
  constructor(absent,present, date, userId) {
    this.absent = absent;
    this.present = present;
    this.date = date;
    this.userId = userId;
  }
}