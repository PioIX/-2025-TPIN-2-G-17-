var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const session = require('express-session');             // Para el manejo de las variables de sesión
const path = require('path');
const { realizarQuery } = require('./modulos/mysql');
const { Console } = require('console');

var app = express(); //Inicializo express
const port = process.env.PORT || 4000;                              // Puerto por el que estoy ejecutando la página Web

// Asegurate de exponer la carpeta front para acceder a las imágenes
app.use(express.static(path.join(__dirname, './front'))); // o './front' si estás adentro del mismo nivel

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

//Pongo el servidor a escuchar
const server = app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}
        `);
});

const io = require('socket.io')(server, {
    cors: {
        // IMPORTANTE: REVISAR PUERTO DEL FRONTEND
        origin: ["http://localhost:3000", "http://localhost:3001"], // Permitir el origen localhost:3000
        methods: ["GET", "POST", "PUT", "DELETE"],      // Métodos permitidos
        credentials: true                               // Habilitar el envío de cookies
    }
});

const sessionMiddleware = session({
    //Elegir tu propia key secreta
    secret: "supersarasa",
    resave: false,
    saveUninitialized: false
});

app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

/*
    A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
    A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
    A PARTIR DE ACÁ LOS EVENTOS DEL SOCKET
*/

io.on("connection", (socket) => {
    const req = socket.request;

    socket.on('joinRoom', data => {
        console.log("🚀 ~ io.on ~ req.session.room:", data.room)
        if (req.session.room != undefined && req.session.room.length > 0)
            socket.leave(req.session.room);
        req.session.room = data.room;
        socket.join(data.room);

        io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: data.room });
    });

    socket.on('pingAll', data => {
        console.log("PING ALL: ", data);
        io.emit('pingAll', { event: "Ping to all", message: data });
    });
    /*
        socket.on('sendMessage', data => {
            io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data });
        });*/
    socket.on('sendMessage', ({ room, message }) => {
        console.log("📤 Mensaje recibido en back:", { room, message });
        io.to(room).emit('newMessage', { room, message });
    });

    socket.on('disconnect', () => {
        console.log("Disconnect");
    })

    socket.on("colorChange", ({ room, color }) => {
        console.log(`🎨 Cambio de color en ${room}: ${color}`);
        socket.to(room).emit("updateColor", { color });
    });
/*
    socket.on("comenzarRonda", (roomId) => {
        const jugadores = getJugadoresPorSala(roomId);  // Obtén los jugadores de esa sala

        // Asegúrate de que no se repitan cartas entre los jugadores
        let cartasDisponibles = [...personajes];  // Aquí debes pasar el array de personajes

        // Asignar una carta aleatoria a cada jugador
        jugadores.forEach(jugador => {
            if (cartasDisponibles.length > 0) {
                // Seleccionar una carta aleatoria
                const cartaAleatoria = cartasDisponibles.splice(Math.floor(Math.random() * cartasDisponibles.length), 1)[0];

                // Guardar la carta asignada al jugador
                cartasAsignadasPorSala[roomId] = cartasAsignadasPorSala[roomId] || {};
                cartasAsignadasPorSala[roomId][jugador.id] = cartaAleatoria;

                // Emitir la carta asignada al jugador
                socket.to(jugador.id).emit("cartaAsignada", cartaAleatoria);
            }
        });
    });
*/
    socket.on("comenzarRonda", (roomId) => {
        const jugadores = getJugadoresPorSala(roomId);  // Obtén los jugadores de esa sala
        let cartasDisponibles = [...personajes];  // Cartas disponibles

        jugadores.forEach(jugador => {
            const cartaAleatoria = cartasDisponibles.splice(Math.floor(Math.random() * cartasDisponibles.length), 1)[0];
            io.to(jugador.id).emit("cartaAsignada", cartaAleatoria);  // Emitir la carta al jugador
            console.log("Carta asignada a", jugador.id, cartaAleatoria);
        });
    });


});

app.get('/', function (req, res) {
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});

/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 */


//login

app.post('/login', async function (req, res) {
    console.log(req.body);
    try {
        const resultado = await realizarQuery(`
            SELECT * FROM Usuarios 
            WHERE nombre = '${req.body.nombre}' AND contraseña = '${req.body.contraseña}'
        `);
        if (resultado.length != 0) {
            if (resultado[0].es_admin === 0) {
                res.send({ ok: true, admin: false, id: resultado[0].ID })
            } else {
                res.send({ ok: true, admin: true, id: resultado[0].ID })
            }
        } else {
            res.send({ message: "Error, no se encontró ningun usuario" })
        }

    } catch (error) {
        res.send({
            ok: false,
            mensaje: "Error en el servidor",
            error: error.message
        });
    }
});

//registro
app.post('/registro', async function (req, res) {
    try {
        console.log(req.body)
        vector = await realizarQuery(`SELECT * FROM Usuarios WHERE nombre='${req.body.nombre}'`)

        if (vector.length == 0) {
            realizarQuery(`
                INSERT INTO Usuarios (nombre, contraseña, mail, puntaje, es_admin) VALUES
                    ('${req.body.nombre}','${req.body.contraseña}','${req.body.mail}',0, 0);
            `)
            res.send({ res: "ok", agregado: true })
        } else {
            res.send({ res: "Ya existe ese dato", agregado: false })
        }
    } catch (e) {
        res.status(500).send({
            agregado: false,
            mensaje: "Error en el servidor",
            error: e.message
        });
    }
})

app.post("/chats", async function (req, res) {
    try {
        console.log(req.body)
        const resultado = await realizarQuery(`
            SELECT Chats.ID, Chats.nombre, Chats.foto, Chats.es_grupo
            FROM Chats
            INNER JOIN UsuariosPorChat ON UsuariosPorChat.id_chat = Chats.ID
            WHERE UsuariosPorChat.id_usuario = "${req.body.id_usuario}"
            AND Chats.nombre IS NOT NULL
            AND Chats.nombre != ""
            AND (Chats.es_grupo = 1 OR Chats.es_grupo = 0)

        `);
        res.send(resultado);
    } catch (error) {
        res.send({
            ok: false,
            mensaje: "Error en el servidor",
            error: error.message
        });
    }
});

app.post("/traerUsuarios", async function (req, res) {
    try {
        console.log("BODY:", req.body);

        const resultado = await realizarQuery(`
            SELECT u.ID, u.nombre, upc.id_chat, u.foto_perfil
            FROM Usuarios u
            INNER JOIN UsuariosPorChat upc ON upc.id_usuario = u.ID
            WHERE upc.id_chat IN (
            SELECT id_chat
            FROM UsuariosPorChat
            WHERE id_usuario = ${req.body.id_usuario}
            )
            AND u.ID != ${req.body.id_usuario}
            AND (u.nombre != "" AND u.nombre IS NOT NULL)
        `);

        console.log("RESULTADO:", resultado);
        res.send(resultado);
    } catch (error) {
        console.error("ERROR traerUsuarios:", error.message);
        res.send({ ok: false, mensaje: "Error en el servidor", error: error.message });
    }
});

//JUEGO
app.get('/farandula', async (req, res) => {
    try {
        const personajes = await realizarQuery("SELECT * FROM Personajes WHERE categoria_id = 1");
        console.log("personajes:", personajes);
        if (!personajes || personajes.length === 0) {
            return res.json({ ok: false, mensaje: "No hay personajes" });
        }
        res.json({
            ok: true,
            personajes: personajes.map(personaje => ({
                id: personaje.ID,
                nombre: personaje.nombre,
                foto: personaje.foto,
                categoria_id: personaje.categoria_id
            }))
        });

    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({
            ok: false,
            mensaje: "Error en el servidor",
            error: error.message
        });
    }
});

app.get('/famosos', async (req, res) => {
    try {
        const personajes = await realizarQuery("SELECT * FROM Personajes WHERE categoria_id = 2");
        console.log("personajes:", personajes);
        if (!personajes || personajes.length === 0) {
            return res.json({ ok: false, mensaje: "No hay personajes" });
        }
        res.json({
            ok: true,
            personajes: personajes.map(personaje => ({
                id: personaje.ID,
                nombre: personaje.nombre,
                foto: personaje.foto,
                categoria_id: personaje.categoria_id
            }))
        });

    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({
            ok: false,
            mensaje: "Error en el servidor",
            error: error.message
        });
    }
});

app.get('/cantantes', async (req, res) => {
    try {
        const personajes = await realizarQuery("SELECT * FROM Personajes WHERE categoria_id = 3");
        console.log("personajes:", personajes);
        if (!personajes || personajes.length === 0) {
            return res.json({ ok: false, mensaje: "No hay personajes" });
        }
        res.json({
            ok: true,
            personajes: personajes.map(personaje => ({
                id: personaje.ID,
                nombre: personaje.nombre,
                foto: personaje.foto,
                categoria_id: personaje.categoria_id
            }))
        });

    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({
            ok: false,
            mensaje: "Error en el servidor",
            error: error.message
        });
    }
});

app.get('/scaloneta', async (req, res) => {
    try {
        const personajes = await realizarQuery("SELECT * FROM Personajes WHERE categoria_id = 4");
        console.log("personajes:", personajes);
        if (!personajes || personajes.length === 0) {
            return res.json({ ok: false, mensaje: "No hay personajes" });
        }
        res.json({
            ok: true,
            personajes: personajes.map(personaje => ({
                id: personaje.ID,
                nombre: personaje.nombre,
                foto: personaje.foto,
                categoria_id: personaje.categoria_id
            }))
        });

    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({
            ok: false,
            mensaje: "Error en el servidor",
            error: error.message
        });
    }
});








//agregar chats

app.post("/agregarChat", async function (req, res) {
    try {
        let chatId;

        if (req.body.es_grupo == 1) {
            const nombre = req.body.nombre ?? "Grupo sin nombre";
            // Insertar el grupo
            const resultado = await realizarQuery(`
        
                INSERT INTO Chats (es_grupo, foto, nombre, descripcion_grupo)
                VALUES (1, '${req.body.foto}', '${req.body.nombre}', '${req.body.descripcion_grupo}')
            `);

            chatId = resultado.insertId;

            // Insertar al creador del grupo
            await realizarQuery(`
        
            INSERT INTO UsuariosPorChat (id_chat, id_usuario)
            VALUES (${chatId}, ${req.body.id_usuario})
            `);

            // Insertar a los demás usuarios por mail
            for (const mail of req.body.mails) {
                const usuarios = await realizarQuery(`
          SELECT ID FROM Usuarios WHERE usuario_mail = '${mail}'
        `);
                if (usuarios.length > 0 && usuarios[0].ID != req.body.id_usuario) {
                    const userId = usuarios[0].ID;
                    await realizarQuery(`
            INSERT INTO UsuariosPorChat (id_chat, id_usuario)
            VALUES (${chatId}, ${userId})
          `);
                }
            }

            console.log(chatId)

        } else {
            // Insertar chat individual (campos vacíos salvo es_grupo = 0)
            const resultado = await realizarQuery(`
        INSERT INTO Chats (es_grupo, foto, nombre, descripcion_grupo)
        VALUES (0, NULL, NULL, NULL)
      `);
            chatId = resultado.insertId;

            // obtener id del otro usuario por mail
            const usuarios = await realizarQuery(`
        SELECT ID FROM Usuarios WHERE usuario_mail = '${req.body.mail}'
      `);
            const otroUsuarioId = usuarios[0].ID;

            // vincular usuarios al chat
            await realizarQuery(`
        INSERT INTO UsuariosPorChat (id_chat, id_usuario)
        VALUES (${chatId}, ${req.body.id_usuario}), (${chatId}, ${otroUsuarioId})
      `);
        }

        res.send({ ok: true, id_chat: chatId });
    } catch (error) {
        res.status(500).send({
            ok: false,
            mensaje: "Error en el servidor",
            error: error.message,
        });
    }
});

//traer contactos
app.post('/contacto', async (req, res) => {
    try {
        const contactos = await realizarQuery(`
            SELECT Chats.ID , Chats.nombre
            FROM Chats
            INNER JOIN UsuariosPorChat ON UsuariosPorChat.id_chat = Chats.ID
            WHERE UsuariosPorChat.id_usuario = "${req.body.id_usuario}"

        `);

        if (contactos.length === 0) {
            return res.send({ ok: false, mensaje: "No se encontró el contacto" });
        }
        const contacto = contactos[0];

        res.send({
            ok: true,
            contacto: {
                ID: contacto.ID,
                nombre: contacto.nombre,
            }
        });

    } catch (error) {
        res.status(500).send({
            ok: false,
            mensaje: "Error en el servido ASDRAAAAAAA",
            error: error.message,
        });
    }
});

//eliminar contactos
app.post('/eliminarContacto', async function (req, res) {
    try {
        const { id_chat, id_usuario } = req.body;

        await realizarQuery(
            `DELETE FROM UsuariosPorChat WHERE id_chat=${id_chat} AND id_usuario=${id_usuario}`
        );

        res.send({ ok: true, mensaje: "Contacto eliminado del chat" });
    } catch (error) {
        res.status(500).send({
            ok: false,
            mensaje: "Error en el servidor",
            error: error.message
        });
    }
});

//subir mensajes a bbdd
app.post('/mensajes', async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);
        await realizarQuery(`
                INSERT INTO Mensajes (contenido, fecha_hora, id_usuario, id_chat) VALUES
            ("${req.body.contenido}","${req.body.fecha_hora}",${req.body.id_usuario},${req.body.id_chat});`
        );

        res.send({ res: "ok", agregado: true });
    } catch (e) {
        res.status(500).send({
            agregado: false,
            mensaje: "Error en el servidor",
            error: e.message
        });
    }
});


app.get('/infoUsuario', async (req, res) => {
    try {
        const userId = req.session.userId; // segun chat gpt esto toma el id del usuario q inicio sesion
        if (!userId) {
            return res.status(401).send({ ok: false, mensaje: "Usuario no logueado" });
        }

        const usuario = await realizarQuery(
            "SELECT ID, nombre FROM Usuarios WHERE ID = ? LIMIT 1",
            [userId]
        );

        if (usuario.length === 0) {
            return res.send({ ok: false, mensaje: "Usuario no encontrado" });
        }

        res.send({
            ok: true,
            usuario: usuario[0],
        });
    } catch (error) {
        res.status(500).send({ ok: false, mensaje: "Error en el servidor", error: error.message });
    }
});

app.post('/encontrarMensajesChat', async (req, res) => {
    const { chatSeleccionadoId } = req.body;
    console.log("Body recibido:", req.body);

    try {
        const respuesta = await realizarQuery(`
            SELECT Mensajes.id_chat, Mensajes.id_usuario, Mensajes.contenido, Mensajes.fecha_hora, Usuarios.nombre
            FROM Mensajes
            INNER JOIN Usuarios ON Usuarios.ID = Mensajes.id_usuario
            WHERE Mensajes.id_chat = "${chatSeleccionadoId}"
            ORDER BY Mensajes.fecha_hora ASC
        `);

        res.json({ ok: true, mensajes: respuesta });
    } catch (error) {
        console.error("Error al traer mensajes:", error);
        res.status(500).send({ ok: false, mensaje: "Error en el servidor", error: error.message });
    }
});


//PEDIDOS ADMIN

app.post('/agregarUsuario', async function (req, res) {
    console.log(req.body);

    try {
        const { nombre, contraseña, mail, es_admin } = req.body;

        // Verificar si ya existe el usuario
        const vector = await realizarQuery(`SELECT * FROM Usuarios WHERE nombre = "${nombre}"`);

        if (vector.length === 0) {
            await realizarQuery(`
                INSERT INTO Usuarios (nombre, contraseña, mail, puntaje, es_admin)
                VALUES ("${nombre}", "${contraseña}", "${mail}", 0, ${es_admin});
            `);
            res.send({ agregado: true });
        } else {
            res.send({ agregado: false, mensaje: "Ya existe ese usuario" });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send({ agregado: false, error: "Error en el servidor" });
    }
});



//BORRAR USUARIO
app.delete('/borrarUsuario', async function (req, res) {
    try {
        const ID = req.body.ID;

        const vector = await realizarQuery(`SELECT * FROM Usuarios WHERE ID='${ID}'`);

        if (vector.length > 0) {
            await realizarQuery(`DELETE FROM Usuarios WHERE ID='${ID}'`);
            res.send({ borrado: true, mensaje: "Usuario eliminado correctamente" });
        } else {
            res.send({ borrado: false, mensaje: "Usuario no encontrado" });
        }

    } catch (error) {
        res.status(500).send({
            borrado: false,
            mensaje: "Error en el servidor",
            error: error.message
        });
    }
});

//Agregar autor
app.post('/agregarAutor', async function (req, res) {
    try {
        const { nombre, apellido, origen, imagen } = req.body;

        if (!nombre || !apellido || !origen || !imagen) {
            return res.send({ ok: false, mensaje: "Faltan datos" });
        }

        await realizarQuery(`
            INSERT INTO Autores (nombre, apellido, origen, imagen)
            VALUES ('${nombre}', '${apellido}', '${origen}', '${imagen}');
        `);

        res.send({ ok: true, mensaje: "Autor agregado correctamente" });
    } catch (error) {
        console.error("Error al agregar autor:", error);
        res.send({ ok: false, mensaje: "Error en el servidor", error: error.message });
    }
});

//modificar frases
app.put('/modificarFrase', async function (req, res) {
    try {
        await realizarQuery(`UPDATE Frases SET
            contenido = '${req.body.contenido}', procedencia = '${req.body.procedencia}', id_autor = ${req.body.id_autor}, id_autor_incorrecto = ${req.body.id_autor_incorrecto} WHERE ID = ${req.body.id};`);

        res.send({ ok: true, mensaje: "Frase modificada correctamente" });
    } catch (e) {
        console.log("ERROR:", e.message);
        res.send({ ok: false, mensaje: "Error en la modificación", error: e.message });
    }
});

const turnos = {};  // Guardar el turno de cada sala

io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => {
        const room = data.room;
        socket.join(room);

        if (!turnos[room]) {
            turnos[room] = 'yo'; // El primer jugador tiene el turno
        }

        socket.emit("cambioTurno", turnos[room]);
    });

    socket.on("sendMessage", ({ room, message }) => {
        io.to(room).emit('newMessage', { room, message });

        const siguienteTurno = turnos[room] === 'yo' ? 'oponente' : 'yo';
        turnos[room] = siguienteTurno;
        io.to(room).emit("cambioTurno", siguienteTurno);  // Emitir el cambio de turno
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado");
    });
});


