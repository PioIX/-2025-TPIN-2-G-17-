"use client";
import clsx from "clsx";
import styles from "@/componentes/BotonImagen.module.css";

export default function BotonImagen(props) {
  return (
    <button
      onClick={props.onClick}
      type={props.type || "button"}
      className={clsx(styles.botonImagen, {
        [styles.seleccionado]: props.color === "seleccionado",
        [styles.deshabilitado]: props.color === "deshabilitado",
      })}
      disabled={props.disabled}
    >
      <img
        src={props.imagen}
        alt={props.texto || "personaje"}
        className={styles.imagenPersonaje}
      />
      {props.texto}
    </button>
  );
}
