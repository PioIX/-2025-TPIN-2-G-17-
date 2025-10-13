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
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
        if (req.session.room != undefined && req.session.room.length > 0)
            socket.leave(req.session.room);
        req.session.room = data.room;
        socket.join(req.session.room);

        io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: req.session.room });
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
        io.to(room).emit('newMessage', { room, message });
    });



    socket.on('disconnect', () => {
        console.log("Disconnect");
    })
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
            WHERE usuario_mail = '${req.body.usuario_mail}' AND password = '${req.body.contraseña}'
        `);

        if (resultado.length > 0) {
            const usuario = resultado[0];
            res.send({
                ok: true,
                mensaje: "Login correcto",
                id: usuario.ID,
            });
        } else {
            res.send({
                ok: false,
                mensaje: "Credenciales incorrectas"
            });
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
        vector = await realizarQuery(`SELECT * FROM Usuarios WHERE usuario_mail='${req.body.usuario_mail}'`)

        if (vector.length == 0) {
            realizarQuery(`
                INSERT INTO Usuarios (usuario_mail, password, nombre, foto_perfil) VALUES
                    ('${req.body.usuario_mail}','${req.body.password}','${req.body.nombre}','');
            `)

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


/* ACA ARRANCA LO DEL SOCKET */
io.on("connection", (socket) => {
    const req = socket.request;

    socket.on('joinRoom', data => {
        console.log("🚀 ~ io.on ~ req.session.room:", req.session.room)
        if (req.session.room != undefined && req.session.room.length > 0)
            socket.leave(req.session.room);
        req.session.room = data.room;
        socket.join(req.session.room);

        io.to(req.session.room).emit('chat-messages', { user: req.session.user, room: req.session.room });
    });

    socket.on('pingAll', data => {
        console.log("PING ALL: ", data);
        io.emit('pingAll', { event: "Ping to all", message: data });
    });

    socket.on('sendMessage', data => {
        console.log("📤 Mensaje recibido en back:", data);
        io.to(req.session.room).emit('newMessage', { room: req.session.room, message: data, /*usuario: req.session.user*/ usuario: data.usuario });
    });

    socket.on('disconnect', () => {
        console.log("Disconnect");
    })
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
