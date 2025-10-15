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

/*farandula*/
INSERT INTO Personajes (nombre, foto, categoria_id) VALUES
('Usain Bolt', 'Usain Bolt.png', 2),
('Elon Musk', 'Elon Musk.png', 2),
('Michael Jordan', 'Michael Jordan.png', 2),
('James Corden', 'James Corden.png', 2),
('Jimmy Fallon.png', 'Jimmy Fallon.png', 2),
('LeBron James', 'LeBron James.png', 2),
('Margot Robbie', 'Margot Robbie.png', 2),
('Mark Zuckerberg', 'Mark Zuckerberg.png', 2),
('La Roca', 'La Roca.png', 2),
('Salma Hayek', 'Salma Hayek.png', 2),
('Sydney Sweeney', 'Sydney Sweeney.png', 2),
('Tom Holland', 'Tom Hollandy.png', 2),
('Will Smith', 'Will Smith.png', 2),
('Zendaya', 'Zendaya.png', 2),
('Kendall Jenner', 'Kendall Jenner.png', 2),
('Kim Kardashian', 'Kim Kardashian.png', 2),
('Kylie Jenner', 'Kylie Jenner.png', 2),
('Shakira', 'Shakira.png', 2),
('Sofía Vergara', 'Sofía Vergara.png', 2),
('Sandra Bullock', 'Sandra Bullock.png', 2),
