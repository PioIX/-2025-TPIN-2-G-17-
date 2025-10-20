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

CREATE TABLE Partidas (
    ID INT NOT NULL AUTO_INCREMENT,
    jugador1_id INT,
    jugador2_id INT,
    personaje_jugador1_id INT,
    personaje_jugador2_id INT,
    ganador_id INT,
    arriesgo_jugador1 BOOL DEFAULT 0,
    arriesgo_jugador2 BOOL DEFAULT 0,
    estado VARCHAR(50) DEFAULT 'en_curso',
    PRIMARY KEY (ID),
    FOREIGN KEY (jugador1_id) REFERENCES Usuarios(ID),
    FOREIGN KEY (jugador2_id) REFERENCES Usuarios(ID),
    FOREIGN KEY (personaje_jugador1_id) REFERENCES Personajes(ID),
    FOREIGN KEY (personaje_jugador2_id) REFERENCES Personajes(ID),
    FOREIGN KEY (ganador_id) REFERENCES Usuarios(ID)
);

/*farándula*/
INSERT INTO Personajes (nombre, foto, categoria_id) VALUES
('Angel De Brito', 'Angel De Brito.png', 1),
('China Suarez', 'China Suarez.png', 1),
('Flor de la V', 'Flor de la V.png', 1),
('Guido Kaczka.png', 'Guido Kaczka.png.png', 1),
('Juana Viale', 'Juana Viale.png', 1),
('Karina La Princesita', 'Karina La Princesita.png', 1),
('La bomba Tucumana', 'La bomba Tucumana.png', 1),
('Lali', 'Lali.png', 1),
('Lizy Tagliani', 'Lizy Tagliani.png', 1),
('Marcelo Polino', 'Marcelo Polino.png', 1),
('Marcelo Tinelli', 'Marcelo Tinelli.png', 1),
('Marley', 'Marley.png', 1),
('Mirtha Legrand', 'Mirtha Legrand.png', 1),
('Moria', 'Moria.png', 1),
('Pampita', 'Pampita.png', 1),
('Ricardo Fort', 'Ricardo Fort.png', 1),
('Susana Gimenez', 'Susana Gimenez.png', 1),
('Vicky Xipolitakis', 'Vicky Xipolitakis.png', 1),
('Wanda Nara', 'Wanda Nara.png', 1),
('Yanina Latorre', 'Yanina Latorre.png', 1);


/*famosos*/
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

/*cantantes*/
INSERT INTO Personajes (nombre, foto, categoria_id) VALUES
('Aitana', 'Aitana.png', 3),
('Anuel', 'Anuel.png', 3),
('Bad Bunny', 'Bad Bunny.png', 3),
('Dillom', 'Dillom.png', 3),
('Dua Lipa', 'Dua Lipa.png', 3),
('Duki', 'Duki.png', 3),
('Emilia Mernes', 'Emilia Mernes.png', 3),
('Feid', 'Feid.png', 3),
('Maluma', 'Maluma.png', 3),
('Nicki Nicole', 'Nicki Nicole.png', 3),
('Quevedo', 'Quevedo.png', 3),
('Sebastian Yatra', 'Sebastian Yatra.png', 3),
('Taylor Swift', 'Taylor Swift.png', 3),
('The Weekend', 'The Weekend.png', 3),
('Karol G', 'Karol G.png', 3),
('L Gante', 'L Gante.png', 3),
('Lola Indigo', 'Lola Indigo.png', 3),
('Lady Gaga', 'Lady Gaga.png', 3),
('Maria Becerrat', 'Maria Becerra.png', 3),
('Harry Styles', 'Harry Styles.png', 3);

/*scaloneta*/
INSERT INTO Personajes (nombre, foto, categoria_id) VALUES
('Angel Correa', 'Angel Correa.png', 4),
('Cuti Romero', 'Cuti Romero.png', 4),
('De Paul', 'De Paul.png', 4),
('Dibu', 'Dibu.png', 4),
('Enzo Fernandez', 'Enzo Fernandez.png', 4),
('Julian Alvarez', 'Julian Alvarez.png', 4),
('Lautaro Martinez', 'Lautaro Martinez.png', 4),
('Lomonaco', 'Lomonaco.png', 4),
('Mac Allister', 'Mac Allister.png', 4),
('Mastantuono', 'Mastantuono.png', 4),
('Messi', 'Messi.png', 4),
('Montiel', 'Montiel.png', 4),
('Nico Gonzales', 'Nico Gonzales.png', 4),
('Otamendi', 'Otamendi.png', 4),
('Paredes', 'Paredes.png', 4),
('Rulli', 'Rulli.png', 4),
('Simeone', 'Simeone.png', 4),
('Tagliafico', 'Tagliafico.png', 4),
('Foyth', 'Foyth.png', 4),
('Lo Celso', 'Lo Celso.png', 4);
