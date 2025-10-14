"use client"
import clsx from "clsx";
import styles from "@/componentes/Title.module.css"

export default function Title(props) {
    return (
        <>
            <h1 className={
                clsx(
                    {
                        [styles.registro]: props.color == "registro",
                    }
                )}>{props.texto}</h1>
        </>
    )
}