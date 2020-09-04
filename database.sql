CREATE TABLE IF NOT EXISTS users(
  id uuid DEFAULT uuid_generate_v4(),
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP,
  last_login TIMESTAMP,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS roles(
  id uuid DEFAULT uuid_generate_v4(),
  description VARCHAR(50) NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id)
);

