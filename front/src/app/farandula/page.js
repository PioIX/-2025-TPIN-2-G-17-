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
    const personajes = [
        { id: 1, imagen: "/Angel De Brito.png", texto: "Angel de Brito" },
        { id: 2, imagen: "/Lizy Tagliani.png", texto: "Bomba Tucumana" },
        { id: 3, imagen: "/China Suarez.png", texto: "China Suarez" },
        { id: 4, imagen: "/Flor de la V.png", texto: "Flor de la V" },
        { id: 5, imagen: "/Guido Kaczka.png", texto: "Guido Kaczka" },
        { id: 6, imagen: "/Angel De Brito.png", texto: "Angel de Brito" },
        { id: 7, imagen: "/Lizy Tagliani.png", texto: "Bomba Tucumana" },
        { id: 8, imagen: "/China Suarez.png", texto: "China Suarez" },
        { id: 9, imagen: "/Flor de la V.png", texto: "Flor de la V" },
        { id: 10, imagen: "/Guido Kaczka.png", texto: "Guido Kaczka" },
        { id: 11, imagen: "/Angel De Brito.png", texto: "Angel de Brito" },
        { id: 12, imagen: "/Lizy Tagliani.png", texto: "Bomba Tucumana" },
        { id: 13, imagen: "/China Suarez.png", texto: "China Suarez" },
        { id: 14, imagen: "/Flor de la V.png", texto: "Flor de la V" },
        { id: 15, imagen: "/Guido Kaczka.png", texto: "Guido Kaczka" },
        { id: 16, imagen: "/Angel De Brito.png", texto: "Angel de Brito" },
        { id: 17, imagen: "/Lizy Tagliani.png", texto: "Bomba Tucumana" },
        { id: 18, imagen: "/China Suarez.png", texto: "China Suarez" },
        { id: 19, imagen: "/Flor de la V.png", texto: "Flor de la V" },
        { id: 20, imagen: "/Guido Kaczka.png", texto: "Guido Kaczka" },
    ];
    const [mensajes, setMensajes] = useState([]);
    const [message, setMessage] = useState("");
    const [bool, setBool] = useState("");
    const [color, setcolor] = useState("mensaje");

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessage", (data) => {
            console.log("📩 Nuevo mensaje:", data);
            setMensajes((prev) => [...prev, data]);
        });

        return () => {
            socket.off("newMessage");
        };
    }, [socket]);


    function sendMessage() {
        socket.emit("sendMessage", { message });
        console.log({ message })
    }
    useEffect(() => {
        if (!socket) return;
        let room = localStorage.getItem("room")
        if (room) {
            socket.emit("joinRoom", { room: room });
        }
    }, [socket])

    function checkeado(event) {
        setBool(event.target.value)
        if (bool == "si") {
            setcolor("si")
        } else {
            setcolor("no")
        } 
    }

    return (
        <>
            <div className={styles.header}>
                <header>
                    <Title texto={"¿Quién es quién?"} />
                </header>

            </div>
            {/*
            <div className={styles.chatBox}>
                {mensajes.map((m, i) => (
                    <div key={i} className={styles.mensaje}>
                        {m.message.message || m.message}
                    </div>
                ))}
            </div>
            */}
            <div className={styles.chatBox}>
                {mensajes.map((m, i) => (
                    <Mensajes
                        key={i}
                        texto={m.message.message || m.message}
                        color={color} 
                    >
                    </Mensajes>
                ))}
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
            <div className={styles.botonesRespuestas}>
                <Input placeholder={"Hace una pregunta"} color={"registro"} onChange={(e) => setMessage(e.target.value)}></Input>
                <Boton color={"wpp"} texto={"Preguntar"} onClick={sendMessage}></Boton>
            </div>
            <div className={styles.botonesRespuestas}>
                <Boton color={"si"} value={"si"} texto={"Sí"} onClick={checkeado}/>
                <Boton color={"no"} value={"no"} texto={"No"} onClick={checkeado}/>
            </div>
            <div className={styles.footer}>
                <footer>
                    <h2>Arrufat - Gaetani - Suarez - Zuran</h2>
                </footer>

            </div>
        </>
    )
}
