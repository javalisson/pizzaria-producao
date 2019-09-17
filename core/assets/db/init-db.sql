CREATE DATABASE IF NOT EXISTS pizzaria;

CREATE TABLE IF NOT EXISTS pedidos (
  id INT NOT NULL UNIQUE,
  sabor VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS sabores (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  sabor VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL
);

-- INSERT INTO sabores(sabor, descricao) VALUES('calabresa','Pizza Calabresa');
-- INSERT INTO sabores(sabor, descricao) VALUES('portuguesa','Pizza Portuguesa');
-- INSERT INTO sabores(sabor, descricao) VALUES('quatro-queijos','Pizza Quatro Queijos');
-- INSERT INTO sabores(sabor, descricao) VALUES('marguerita','Pizza Marguerita');