const mysql = require('mysql2');
const { SQL_HOST, SQL_USER, SQL_PASS, SQL_DB } = require('../../config/config');





// create the connection to database
const sql = mysql.createConnection({
    host: SQL_HOST,
    user: SQL_USER,
    password: SQL_PASS,
    database: SQL_DB,
    multipleStatements: true
}, () => { console.log("Successfully connected to MySQL Database") });


let base = `USE ${SQL_DB};CREATE TABLE IF NOT EXISTS users (user_id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(45) NOT NULL,
    password varchar(50) NOT NULL,
    email varchar(45) NOT NULL,
    firstname varchar(45) NOT NULL,
    lastname varchar(45) NOT NULL,
    PRIMARY KEY (user_id),
    UNIQUE KEY email_UNIQUE (email),
    UNIQUE KEY username_UNIQUE (username));
    
      CREATE TABLE IF NOT EXISTS files(
    user_id int(11) DEFAULT NULL,
    file_id int(11) NOT NULL AUTO_INCREMENT,
    filename varchar(45) NOT NULL,
    PRIMARY KEY (file_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY filename_UNIQUE (filename));
  
  CREATE TABLE IF NOT EXISTS drive (
    user_id int(11) DEFAULT NULL,
    bucket_key varchar(200) DEFAULT NULL,
    file_id int(11) DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files (file_id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (user_id));`.split('\n')
let setDB = ''
base.forEach((line) => { setDB += line.trim() })
sql.query(setDB)
module.exports = sql;