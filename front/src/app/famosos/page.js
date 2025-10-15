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
                <Boton color={"no"}></Boton> <Boton color={"si"}></Boton>
            </div>
            <div className={styles.footer}>
                <footer>
                    <h2>Arrufat - Gaetani - Suarez - Zuran</h2>
                </footer>

            </div>
        </>
    )
}
