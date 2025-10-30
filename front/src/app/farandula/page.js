"use client"

import Boton from "@/componentes/Boton"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import BotonImagen from "@/componentes/BotonImagen";
import { useSocket } from "@/hooks/useSocket";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation"
import styles from "./page.module.css"
import Mensajes from "@/componentes/Mensajes";

export default function Tablero() {
    const router = useRouter()
    const { socket, isConnected } = useSocket();
    const [mensajes, setMensajes] = useState([]);
    const [message, setMessage] = useState("");
    const [bool, setBool] = useState("");
    const [color, setcolor] = useState("mensaje");
    const [nombreArriesgado, setNombreArriesgado] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [carta, setCarta] = useState(null);
    const [personajes, setPersonajes] = useState([]);
    const [descartadas, setDescartadas] = useState([]);
    const [cartaAsignada, setCartaAsignada] = useState([]);
    const [cartaAsignada2, setCartaAsignada2] = useState([]);
    const [segundos, setSegundos] = useState(5);
    const [turno, setTurno] = useState(1);
    const [jugadorActivo, setJugadorActivo] = useState(1);
    const [idRival, setIdRival] = useState(0);
    const [ordenJugadores, setOrdenJugadores] = useState([localStorage.getItem("ID")]);

    const [onOffTimer, setOnOffTimer] = useState(false)
    const [timer, setTimer] = useState(null)


    async function traerPersonajes() {
        try {
            const response = await fetch("http://localhost:4000/farandula", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            console.log("Data recibida del backend:", data);


            if (data.ok && data.personajes) {
                localStorage.setItem("personajesFarandula", JSON.stringify(data.personajes));
                setPersonajes(data.personajes);
            } else {
                setPersonajes([]);
            }
        } catch (error) {
            console.error("Error al traer personajes:", error);
            setPersonajes([]);
        }
    }

    function handleClick(id) {
        setDescartadas((prev) => {
            const updated = prev.includes(id) ? prev : [...prev, id];
            console.log("IDs descartados:", updated);
            return updated;
        });
    }

    useEffect(() => {
        traerPersonajes();
        traerCarta();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessage", (data) => {
            console.log("📩 Nuevo mensaje:", data);
            setMensajes((prev) => [...prev, data]);
        });

        socket.on("joinedPlayer", (data) => {
            if (localStorage.getItem("ID") != data.idUser) {
                if (data.idUser != undefined && data.idUser != 0) {
                    setIdRival(data.idUser)
                    let aux = [localStorage.getItem("ID"), data.idUser]
                    setJugadoresEnPartida(aux)
                    socket.emit("ordenJugadores", { room: data.room, orden: aux })
                }
            }
        })

        socket.on("ordenJugadoresFijo", data => {
            console.log("ORDEN DE JUGADORES", data.orden)
            if (data.orden != []) {
                setOrdenJugadores(data.orden)
            }
        })

        socket.on("startTurno", (data) => {
            setOnOffTimer(true);
        })

    }, [socket]);



    useEffect(() => {

        if (onOffTimer) {
            const timer = setInterval(() => {
                setSegundos(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);  // Detiene el temporizador cuando llega a 0
                        CambioTurno();    // Cambia el turno
                        return 0;  // Establece el temporizador en 0
                    }
                    return prev - 1;  // Resta un segundo
                });
            }, 1000);

            setTimer(timer) // para apagarlo despues cuando termina el turno
        }


        return (() => {
            clearInterval(timer)
        })

    }, [onOffTimer])


    function sendMessage() {
        const room = localStorage.getItem("room");
        const nuevo = { message, color: "mensaje" };
        // const data = { message, color}
        socket.emit("sendMessage", { room, message });
        console.log("Mensaje enviado:", nuevo);
    }

    useEffect(() => {
        if (!socket) return;
        let room = localStorage.getItem("room")
        if (room) {
            socket.emit("joinRoom", { room: room, idUser: localStorage.getItem("ID") });
        }
    }, [socket])



    async function arriesgar() {
        // Verificación de que el nombre no esté vacío
        if (nombreArriesgado.trim() === "") {
            alert("Ingresá un nombre antes de arriesgar");
            return;
        }

        setLoading(true);  // Inicia el estado de carga

        try {
            const res = await fetch("http://localhost:4000/arriesgar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_partida: partida.ID,
                    id_jugador: jugadorId,
                    nombre_arriesgado: nombreArriesgado
                }),
            });

            // Parsear la respuesta a JSON
            const result = await res.json();

            // Actualizar el mensaje en el estado
            setMensaje(result.msg);

            if (result.ok) {
                if (result.ganador) {
                    setMensaje(`¡Felicidades, ganaste! El personaje correcto era ${nombreArriesgado}.`);
                } else {
                    setMensaje(`Perdiste. El personaje correcto era ${result.personajeCorrecto}.`);
                }

                // Si el jugador ganó o perdió, redirigir a la página de inicio
                router.push("/inicio");
            } else {
                setMensaje("Hubo un problema al realizar el arriesgue.");
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }

        setLoading(false);
    }

    function checkeado(event) {
        const value = event.target.value;
        setBool(value);

        const nuevoColor = value == "si" ? "si" : "no";
        setcolor(nuevoColor);

        setMensajes((prevMensajes) => {
            if (prevMensajes.length == 0) return prevMensajes;
            const nuevos = [...prevMensajes];
            const ultimo = { ...nuevos[nuevos.length - 1] };
            ultimo.color = nuevoColor;
            nuevos[nuevos.length - 1] = ultimo;
            return nuevos;
        });

        const room = localStorage.getItem("room");
        socket.emit("colorChange", { room, color: nuevoColor });



        // si aca termina el turno, apago timer y apago
        setOnOffTimer(false);
        clearInterval(timer);
    }

    useEffect(() => {
        if (!socket) return;
        socket.on("updateColor", ({ color }) => {
            console.log("Nuevo color recibido del otro jugador:", color);
            setMensajes((prevMensajes) => {
                if (prevMensajes.length === 0) return prevMensajes;
                const nuevos = [...prevMensajes];
                const ultimo = { ...nuevos[nuevos.length - 1] };
                ultimo.color = color;
                nuevos[nuevos.length - 1] = ultimo;
                return nuevos;
            });
        });
        return () => socket.off("updateColor");
    }, [socket]);

    // carta random
    /*

    useEffect(() => {
        // Asegúrate de que socket esté disponible y la sala exista
        const room = localStorage.getItem("room");
        const personajes = JSON.parse(localStorage.getItem("personajesFarandula"));
        if (room && socket) {
            console.log("Personajes:", personajes);  // Verifica que sea un array
            socket.emit("comenzarRonda", room, personajes);  // Emitir el evento al backend
        }
    }, [socket]);  // Solo se ejecuta cuando el socket está disponible


    useEffect(() => {
        if (!socket) return;

        socket.on("cartaAsignada", (carta) => {
            console.log("Tu carta asignada es:", carta);  // Verifica que la carta se reciba correctamente
            setCartaAsignada(carta);  // Asigna la carta al jugador
        });

        return () => {
            socket.off("cartaAsignada");  // Limpiar el evento cuando el componente se desmonte
        };
    }, [socket]);
    */
    useEffect(() => {
        // Asegúrate de que socket esté disponible y la sala exista
        const room = localStorage.getItem("room");
        const carta = JSON.parse(localStorage.getItem("carta"));
        const carta2 = JSON.parse(localStorage.getItem("carta2"));
        if (room && socket) {
            socket.emit("cartaRandom", room, carta, carta2);  // Emitir el evento al backend
        }
    }, [socket]);

    useEffect(() => {
        if (!socket) return;

        // Recibe la carta del host
        socket.on("tu carta", ({ carta }) => {
            console.log("Tu carta (host):", carta);  // Aquí deberías ver la carta del host
            setCartaAsignada(carta);  // Guardamos la carta del host en el estado
        });

        // Recibe la carta del oponente
        socket.on("carta del oponente", ({ carta2 }) => {
            console.log("Carta del oponente:", carta2);  // Aquí deberías ver la carta del oponente
            setCartaAsignada2(carta2);  // Guardamos la carta del oponente en el estado
        });

        return () => {
            socket.off("tu carta");
            socket.off("carta del oponente");
        };
    }, [socket]);

    async function traerCarta() {
        try {
            const response = await fetch("http://localhost:4000/random", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            console.log("Data recibida del backend:", data);

            if (data.ok) {
                //localStorage.setItem("personajesFarandula", JSON.stringify(data.personajes));
                setCartaAsignada(data.carta);
                setCartaAsignada2(data.carta2);
                localStorage.setItem("carta", JSON.stringify(data.carta));
                localStorage.setItem("carta2", JSON.stringify(data.carta2));
            } else {
                setCartaAsignada([]);
                setCartaAsignada2([]);
            }
        } catch (error) {
            console.error("Error al traer cartas:", error);
            setCartaAsignada([]);
            setCartaAsignada2([]);
        }
    }

    //temporizador (lo hizo chatg)
    useEffect(() => {
        if (jugadorActivo < 1) return;
        console.log("el jugador activo es: ", jugadorActivo);
        const timer = setInterval(() => {
            setSegundos(prev => {
                if (prev <= 1) {
                    clearInterval(timer);  // Detiene el temporizador cuando llega a 0
                    CambioTurno();    // Cambia el turno
                    return 0;  // Establece el temporizador en 0
                }
                return prev - 1;  // Resta un segundo
            });
        }, 1000);
        console.log("el jugador activo es: ", jugadorActivo);
        return () => clearInterval(timer); // Limpia el intervalo cuando el componente se desmonte

    }, [jugadorActivo]);

    useEffect(() => {
        if (segundos === 0) {
            CambioTurno();
            console.log("el jugador activo es: ", jugadorActivo);
        }
    }, [segundos]);

    function CambioTurno() {
        if (socket && socket.connected) {
            console.log("Emitiendo cambio de turno...");
            //socket.emit('cambiarTurno', { turnoSiguiente: turno === 1 ? 2 : 1 });
            if (turno === 1) {
                setTurno(ordenJugadores[0]);
            } else {
                setTurno(ordenJugadores[1]);
            }
            console.log("Turno cambiado a:", turno);
            setJugadorActivo(turno);  // El siguiente jugador ahora tiene el turno activo
            resetTemporizador();  // Reinicia el temporizador cuando se cambie el turno
        } else {
            console.log("Socket no disponible o desconectado");
        }
    }

    function resetTemporizador() {
        setSegundos(5);
    }

    return (
        <>
            <div className={styles.header}>
                <header>
                    <Title texto={"¿Quién es quién?"} />
                </header>

            </div>
            <div className={styles.timer}>
                {/*Agregar mensaje para si es mi turno o del rival, no por el id */}
                <h1>Turno del Jugador {turno}</h1>
                <p>Tiempo restante: {segundos} segundos</p>
                {/* Aquí va el resto de tu juego */}
            </div>
            <div className={styles.chatBox}>
                {mensajes.map((m, i) => (
                    <Mensajes
                        key={i}
                        texto={m.message?.message || m.message}
                        color={m.color || "mensaje"}
                    />

                ))}
            </div>
            <div className={styles.juego}>
                {personajes.map((p) => (
                    <BotonImagen
                        key={p.id}
                        imagen={`/${p.foto}`}
                        texto={p.nombre}
                        onClick={() => handleClick(p.id)}
                        className={descartadas.includes(p.id) ? styles.descartada : ""}
                    />
                ))}
            </div>
            <div className={styles.botonesRespuestas}>
                <Input placeholder={"Hace una pregunta"} color={"registro"} onChange={(e) => setMessage(e.target.value)}></Input>
                <Boton color={"wpp"} texto={"Preguntar"} onClick={sendMessage}></Boton>
            </div>
            <div className={styles.botonesRespuestas}>
                <Boton color={"si"} value={"si"} texto={"Sí"} onClick={checkeado} />
                <Boton color={"no"} value={"no"} texto={"No"} onClick={checkeado} />
            </div>

            <Input type="text" placeholder="Arriesgar" id="arriesgar" color="registro" onChange={(e) => setNombreArriesgado(e.target.value)}></Input>
            <Boton onClick={arriesgar} color="arriesgar">texto={"Arriesgar"}</Boton>

            <div className={styles.carta}>
                <h2>Tu carta:</h2>
                {cartaAsignada.map((p) => (
                    <BotonImagen
                        key={p.id}
                        imagen={`/${p.foto}`}
                        texto={p.nombre}
                        onClick={() => handleClick(p.id)}
                        className={descartadas.includes(p.id) ? styles.descartada : ""}
                    />
                ))}
            </div>

            <div className={styles.footer}>
                <footer>
                    <h2>Arrufat - Gaetani - Suarez - Zuran</h2>
                </footer>
            </div>
        </>
    )
}