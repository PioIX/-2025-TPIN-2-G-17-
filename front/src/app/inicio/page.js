"use client"

import Boton from "@/componentes/Boton"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./page.module.css"
import { useSocket } from "@/hooks/useSocket";

export default function LoginPage() {
    const router = useRouter()
    const { socket } = useSocket();

    const irFamosos = () => {
        router.push("/famosos");
        socket.emit("joinRoom", { room: "famosos" });
    };
    const irScaloneta = () => {
        router.push("/scaloneta");
        socket.emit("joinRoom", { room: "scaloneta" });
    };
    const irProfesores = () => {
        router.push("/profesores");
        socket.emit("joinRoom", { room: "profesores" });
    };
    const irFarandula = () => {
        router.push("/farandula");
        localStorage.setItem("room", "farandula")
        socket.emit("joinRoom", { room: "farandula" });
    };
    const irCantantes = () => {
        router.push("/cantantes");
        socket.emit("joinRoom", { room: "cantantes" });
    };


    async function crearPartida(categoria_id) {
        const jugador1_id = parseInt(localStorage.getItem("ID"));
        if (!jugador1_id) {
            alert("No se encontró tu usuario");
            return;
        }

        try {
            const res = await fetch("http://localhost:4000/crearPartida", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categoria_id, jugador1_id }),
            });

            const result = await res.json();

            if (result.ok) {
                localStorage.setItem("partidaActual", JSON.stringify(result.partida));
                router.push("/juego"); 
            } else {
                alert(result.msg || "Error al crear partida");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión con el servidor");
        }
    }


    
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
        <div className={styles.footer}>
            <footer>
                <h2>Arrufat - Gaetani - Suarez - Zuran</h2>
            </footer>

        </div>
    </>
)
}