DROP TABLE IF EXISTS Mensajes;
DROP TABLE IF EXISTS Usuarios;
DROP TABLE IF EXISTS Chats;
DROP TABLE IF EXISTS UsuariosPorChat;

ALTER TABLE Usuarios ADD COLUMN lista_contactos TEXT;

CREATE TABLE Usuarios(
    ID INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    usuario_mail VARCHAR(255),
    password VARCHAR(255),
    foto_perfil VARCHAR(255),
    descripción VARCHAR(255),
    PRIMARY KEY (ID)
);

CREATE TABLE Chats (
    ID INT NOT NULL AUTO_INCREMENT,
    es_grupo BOOLEAN,
    foto VARCHAR(255),
    nombre VARCHAR(255),
    descripcion_grupo VARCHAR(255),
    PRIMARY KEY (ID),
);

CREATE TABLE UsuariosPorChat (
    ID INT NOT NULL AUTO_INCREMENT,
    id_chat INT,
    id_usuario INT,
    PRIMARY KEY (ID)
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(ID),
    FOREIGN KEY (id_chat) REFERENCES Chats(ID)
);

CREATE TABLE Mensajes (
    ID INT NOT NULL AUTO_INCREMENT,
    contenido VARCHAR(2000),
    fecha_hora DATETIME,
    id_usuario INT,
    id_chat INT,
    PRIMARY KEY (ID)
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(ID),
    FOREIGN KEY (id_chat) REFERENCES Chats(ID)
);


INSERT INTO Usuarios (nombre, apellido, usuario_mail, password, foto_perfil, descripción)
VALUES
('').
('');

INSERT INTO Chats (historial, es_grupo, foto, nombre, descripcion_grupo)
VALUES
(),
();

INSERT INTO Mensajes (contenido, fecha_hora, id_usuario, id_chat)
VALUES
(''),
('');

INSERT INTO UsuariosPorChat (id_chat, id_usuario)
VALUES
(),
();
