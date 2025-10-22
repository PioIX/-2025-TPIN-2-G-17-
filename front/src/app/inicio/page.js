"use client"

import Boton from "@/componentes/Boton"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./page.module.css"
import { useSocket } from "@/hooks/useSocket";

export default function LoginPage() {
    const router = useRouter();
    const { socket } = useSocket();
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    const jugadorId = localStorage.getItem('ID'); // Obtener ID del jugador desde localStorage

    // Función para manejar la selección de categoría
    const manejarSeleccionCategoria = async (categoriaId) => {
        setCategoriaSeleccionada(categoriaId); // Guarda la categoría seleccionada
        setLoading(true);
        setMensaje(""); // Limpia mensaje anterior

        if (!jugadorId) {
            alert("No se encontró el ID del jugador. Por favor, inicia sesión.");
            return;
        }

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

            setMensaje(result.msg); // Actualiza el mensaje recibido del backend

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
    };

    // Funciones para cada categoría (manteniendo el router.push y la creación de partida)
    const irFamosos = () => {
        manejarSeleccionCategoria(2); // Asumiendo que 1 es el ID de la categoría "Famosos"
        socket.emit("joinRoom", { room: "famosos" });
    };

    const irScaloneta = () => {
        manejarSeleccionCategoria(5); // ID para la categoría "Scaloneta"
        socket.emit("joinRoom", { room: "scaloneta" });
    };

    const irProfesores = () => {
        manejarSeleccionCategoria(3); // ID para la categoría "Profesores"
        socket.emit("joinRoom", { room: "profesores" });
    };

    const irFarandula = () => {
        manejarSeleccionCategoria(1); // ID para la categoría "Farandula"
        localStorage.setItem("room", "farandula");
        socket.emit("joinRoom", { room: "farandula" });
    };

    const irCantantes = () => {
        manejarSeleccionCategoria(4); // ID para la categoría "Cantantes"
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

            {loading && <p>Esperando a que se cree la partida...</p>} {/* Estado de carga */}
            {mensaje && <p>{mensaje}</p>} {/* Mensaje de respuesta */}
            
            <div className={styles.footer}>
                <footer>
                    <h2>Arrufat - Gaetani - Suarez - Zuran</h2>
                </footer>
            </div>
        </>
    );
}
