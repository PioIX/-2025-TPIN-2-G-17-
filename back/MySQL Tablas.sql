DROP TABLE IF EXISTS Categorias;
DROP TABLE IF EXISTS Personajes;
DROP TABLE IF EXISTS Usuarios;

CREATE TABLE Categorias (
    ID INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE Personajes (
    ID INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255),
    foto VARCHAR(255),
    categoria_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (categoria_id) REFERENCES Categorias(ID)
);

CREATE TABLE Usuarios(
    ID INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255),
    contraseña VARCHAR(255),
    mail VARCHAR(255),
    puntaje INT,
    es_admin BOOL,
    PRIMARY KEY (id)
);