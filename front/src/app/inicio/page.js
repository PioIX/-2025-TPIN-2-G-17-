"use client";

import Boton from "@/componentes/Boton";
import Title from "@/componentes/Title";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useSocket } from "@/hooks/useSocket";

export default function LoginPage() {
    const router = useRouter();
    const { socket } = useSocket();
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [jugadorId, setJugadorId] = useState(null);

    useEffect(() => {
        console.log(localStorage.getItem("ID"));
        if (typeof window !== "undefined") {
            const id = localStorage.getItem("ID");
            if (id) {
                setJugadorId(id);
            }
        }
    }, []);

    async function manejarSeleccionCategoria(categoriaId) {
        if (!jugadorId) {
            alert("No se encontró el ID del jugador. Por favor, inicia sesión.");
            return;
        }

        setCategoriaSeleccionada(categoriaId);
        setLoading(true);
        setMensaje("");

        try {
            const res = await fetch("http://localhost:4000/crearPartida", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    categoria_id: categoriaId,
                    jugador1_id: jugadorId,
                }),
            });

            const result = await res.json();
            setMensaje(result.msg);

            console.log(result)
            console.log(result.userHost)
            if (result.ok) {
                if (result.esperando) {
                    setMensaje("Esperando oponente...");
                } else {
                    router.push(`/${result.nombreCategoria}`);
                }
            } else {
                setMensaje("Hubo un problema al crear la partida.");
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }

        setLoading(false); // Termina el estado de carga
    }


    useEffect(() => {
        if (socket) {
            socket.on("partidaCreada", (data) => {
                console.log("Evento recibido:", data);

                if (data.ok && !data.esperando) {
                    setMensaje("¡La partida ha comenzado!");
                    router.push(`/${data.nombreCategoria}`);
                } else if (data.esperando) {
                    if (Number(data.userHost) === localStorage.getItem("ID")) {
                        setMensaje("Esperando oponente...");
                    }
                }
            });
            return () => {
                socket.off("partidaCreada");
            };
        }
    }, [socket, router]);

    
    const irFamosos = () => {
        manejarSeleccionCategoria(2);
        socket.emit("joinRoom", { room: "famosos" });
    };

    const irScaloneta = () => {
        manejarSeleccionCategoria(5);
        socket.emit("joinRoom", { room: "scaloneta" });
    };

    const irProfesores = () => {
        manejarSeleccionCategoria(3);
        socket.emit("joinRoom", { room: "profesores" });
    };

    const irFarandula = () => {
        manejarSeleccionCategoria(1);
        localStorage.setItem("room", "farandula");
        socket.emit("joinRoom", { room: "farandula" });
    };

    const irCantantes = () => {
        manejarSeleccionCategoria(4);
        socket.emit("joinRoom", { room: "cantantes" });
    };

    return (
        <>
            <div className={styles.header}>
                <header>
                    <Title texto={"¿Quién es quién?"} />
                </header>
            </div>
            <div className={styles.container}>
                <Boton texto={"Famosos"} color={"famosos"} onClick={irFamosos} />
                <Boton texto={"Scaloneta"} color={"scaloneta"} onClick={irScaloneta} />
                <Boton texto={"Profesores"} color={"profesores"} onClick={irProfesores} />
                <Boton texto={"Farandula"} color={"farandula"} onClick={irFarandula} />
                <Boton texto={"Cantantes"} color={"cantantes"} onClick={irCantantes} />
            </div>

            {loading && <p>Esperando a que se cree la partida...</p>}
            {mensaje && <p>{mensaje}</p>}

            <div className={styles.footer}>
                <footer>
                    <h2>Arrufat - Gaetani - Suarez - Zuran</h2>
                </footer>
            </div>
        </>
    );
}
