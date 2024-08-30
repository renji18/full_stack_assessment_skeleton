-- Create a transaction
START TRANSACTION;

-- Create the new user table
CREATE TABLE IF NOT EXISTS user (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL
);

-- Create the new home table
CREATE TABLE IF NOT EXISTS home (
  home_id INT AUTO_INCREMENT PRIMARY KEY,
  street_address VARCHAR(255) NOT NULL,
  state VARCHAR(50),
  zip VARCHAR(10),
  sqft FLOAT,
  beds INT,
  baths INT,
  list_price FLOAT
);

-- Create a temporary table to hold the migrated data
CREATE TABLE IF NOT EXISTS temp_user_home (
  username VARCHAR(100),
  email VARCHAR(100),
  street_address VARCHAR(255),
  state VARCHAR(50),
  zip VARCHAR(10),
  sqft FLOAT,
  beds INT,
  baths INT,
  list_price FLOAT
);

-- Insert data from the old user_home table into the temporary table
INSERT INTO temp_user_home
SELECT *
FROM user_home;

-- Insert unique users into the user table
INSERT INTO user (username, email)
SELECT DISTINCT username, email
FROM temp_user_home;

-- Insert unique homes into the home table
INSERT INTO home (
    street_address,
    state,
    zip,
    sqft,
    beds,
    baths,
    list_price
  )
SELECT DISTINCT street_address,
  state,
  zip,
  sqft,
  beds,
  baths,
  list_price
FROM temp_user_home;

-- Create the new user_home table to link users and homes
CREATE TABLE IF NOT EXISTS new_user_home (
  user_id INT,
  home_id INT,
  FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
  FOREIGN KEY (home_id) REFERENCES home(home_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, home_id)
);

-- Insert user-home relationships into the new user_home table
INSERT INTO new_user_home (user_id, home_id)
SELECT u.user_id,
  h.home_id
FROM temp_user_home uh
  JOIN user u ON uh.username = u.username
  JOIN home h ON uh.street_address = h.street_address
WHERE uh.state = h.state
  AND uh.zip = h.zip;

-- Drop the old user_home table
DROP TABLE IF EXISTS user_home;

-- Rename the new_user_home table to user_home
RENAME TABLE new_user_home TO user_home;

-- Drop the temporary table
DROP TABLE IF EXISTS temp_user_home;

-- Commit the transaction
COMMIT;
