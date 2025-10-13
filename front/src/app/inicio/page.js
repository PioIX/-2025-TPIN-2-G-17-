"use client"

import Boton from "@/componentes/Boton"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./page.module.css"

export default function LoginPage() {
    const router = useRouter()
    const irFamosos = () => {
        router.push("/famosos");
    };
    const irScaloneta = () => {
        router.push("/scaloneta");
    };
    const irProfesores = () => {
        router.push("/profesores");
    };
    const irFarandula = () => {
        router.push("/farandula");
    };
    const irCantantes = () => {
        router.push("/cantantes");
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
        </>
    )
}