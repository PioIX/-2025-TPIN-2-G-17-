"use client"

import Boton from "@/componentes/Boton"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import BotonImagen from "@/componentes/BotonImagen";

import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./page.module.css"

export default function Tablero() {
    const router = useRouter()
    const partida = JSON.parse(localStorage.getItem("partidaActual"));
    const jugadorId = parseInt(localStorage.getItem("ID"));

    const [nombreArriesgado, setNombreArriesgado] = useState("");
    const [mensaje, setMensaje] = useState("");
    
    const personajes = [
        { id: 1, imagen: "/Angel De Brito.png", texto: "Angel de Brito" },
        { id: 2, imagen: "/Bomba Tucumana.png", texto: "Bomba Tucumana" },
        { id: 3, imagen: "/China Suarez.png", texto: "China Suarez" },
        { id: 4, imagen: "/Flor de la V.png", texto: "Flor de la V" },
        { id: 5, imagen: "/Guida Kaczka.png", texto: "Guido Kaczka" },
        { id: 6, imagen: "/Angel De Brito.png", texto: "Angel de Brito" },
        { id: 7, imagen: "/Bomba Tucumana.png", texto: "Bomba Tucumana" },
        { id: 8, imagen: "/China Suarez.png", texto: "China Suarez" },
        { id: 9, imagen: "/Flor de la V.png", texto: "Flor de la V" },
        { id: 10, imagen: "/Guida Kaczka.png", texto: "Guido Kaczka" },
        { id: 11, imagen: "/Angel De Brito.png", texto: "Angel de Brito" },
        { id: 12, imagen: "/Bomba Tucumana.png", texto: "Bomba Tucumana" },
        { id: 13, imagen: "/China Suarez.png", texto: "China Suarez" },
        { id: 14, imagen: "/Flor de la V.png", texto: "Flor de la V" },
        { id: 15, imagen: "/Guida Kaczka.png", texto: "Guido Kaczka" },
        { id: 16, imagen: "/Angel De Brito.png", texto: "Angel de Brito" },
        { id: 17, imagen: "/Bomba Tucumana.png", texto: "Bomba Tucumana" },
        { id: 18, imagen: "/China Suarez.png", texto: "China Suarez" },
        { id: 19, imagen: "/Flor de la V.png", texto: "Flor de la V" },
        { id: 20, imagen: "/Guida Kaczka.png", texto: "Guido Kaczka" },
    ];

    async function arriesgar() {
        if (!nombreArriesgado.trim()) {
            alert("Ingresá un nombre antes de arriesgar");
            return;
        }

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

            const result = await res.json();
            setMensaje(result.msg);

            if (result.ok) {
                router.push("/fin-partida"); // o donde quieras mostrar el resultado
            }
        } catch (error) {
            console.error(error);
            alert("Error al conectar con el servidor");
        }
    }


    return (
        <>
            <div className={styles.header}>
                <header>
                    <Title texto={"¿Quién es quién?"} />
                </header>

            </div>
            <div className={styles.juego}>
                {personajes.map((p) => (
                    <BotonImagen
                        key={p.id}
                        imagen={p.imagen}
                        texto={p.texto}
                        onClick={() => handleClick(p.id)}
                    />
                ))}
            </div>
            <Input type="text" placeholder="Arriesgar" id="arriesgar" color="registro"  onChange={(e) => setNombreArriesgado(e.target.value)}></Input>
            <Boton onClick={arriesgar} color="arriesgar">Arriesgar</Boton>
            <div className={styles.footer}>
                <footer>
                    <h2>Arrufat - Gaetani - Suarez - Zuran</h2>
                </footer>

            </div>
        </>
    )
}
