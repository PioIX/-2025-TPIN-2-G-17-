"use client";
import clsx from "clsx"
import styles from "@/componentes/Mensajes.module.css"

export default function Mensajes(props) {
    return (
        <div
            className={clsx({
                [styles.mensaje]: props.color == "mensaje",
                [styles.si]: props.color == "si",
                [styles.no]: props.color == "no",
            })}
        >{props.texto}</div>
    );
}