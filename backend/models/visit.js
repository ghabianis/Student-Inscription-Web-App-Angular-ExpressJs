const db = require('../util/database');

module.exports = class Visit {
  constructor(email, firstname, lastname,classname) {
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.class = classname;
  }

  static fetchAll() {
    return db.execute('SELECT * FROM students');
  }
  static countStudent() {
    return db.execute('SELECT COUNT(*) FROM students');
  }

  static save(visit) {
    return db.execute(
      'INSERT INTO students (email, firstname, lastname,classname) VALUES (?, ?, ?,?)',
      [visit.email, visit.firstname, visit.lastname,visit.classname]
    );
  }

  static delete(id) {
    return db.execute('DELETE FROM visite WHERE id = ?', [id]);
  }
};