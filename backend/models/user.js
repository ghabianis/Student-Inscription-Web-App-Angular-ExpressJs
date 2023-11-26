const db = require('../util/database');

module.exports = class User {
  constructor(name,username, email, password) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static find(email) {
    return db.execute('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async save(user) {
    try {
      const result = await db.execute('SELECT * FROM users WHERE email = ?', [user.email]);
        // Check if there are any records with the specified email
      const rowsWithData = result[0] || [];
      if (rowsWithData.length === 0) {
        // The email doesn't exist, so we can proceed with the insertion
        return db.execute(
          'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)',
          [user.name, user.username, user.email, user.password]
        );
      } else {
        // The email already exists, so throw an error
        throw new Error('User with the provided email already exists.');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
  
};
