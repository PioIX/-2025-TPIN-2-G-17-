"use client"

import Boton1 from "@/componentes/Boton"
import Input from "@/componentes/Input"
import Title from "@/componentes/Title"
import { useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./page.module.css"

export default function Administrador() {

    const [nombre, setNombre] = useState("")
    const [contraseña, setContraseña] = useState("")
    const [mail, setMail] = useState("")
    const [esAdmin, setEsAdmin] = useState(false)
    const [nombreEliminado, setNombreEliminado] = useState("")

    function subirUsuario() {
        let datos = { nombre, contraseña, mail, es_admin: esAdmin }
        agregarUsuario(datos)

    }

    async function agregarUsuario(datos) {
        try {
            response = await fetch("http://localhost:4000/agregarUsuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datos),
            });
            console.log(response)
            let result = await response.json()
            console.log(result)

            if (result.agregado == true) {
                alert("Usuario agregado correctamente");
            }
        } catch (error) {
            console.log("Error", error);
        }
    }

    function eliminarUsuariosAdmin() {
    let datos = { nombre: nombreEliminado };
    borrarUsuario(datos);
}

async function borrarUsuario(datos) {
    try {
        let response = await fetch("http://localhost:4000/borrarUsuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(datos),
        });

        let result = await response.json();
        console.log(result);

    } catch (error) {
        console.log("Error", error);
        alert("Ocurrió un error al intentar borrar el usuario");
    }
}

    return (
        <>
            <Title>Pagina del Administrador</Title>

            <div className={styles.section}>
                <div className={styles.container}>
                    <Title texto="Agregar usuario" color={"registro"} /><h3></h3><br />
                    <Input color={"registro"} type={"text"} placeholder={"Ingrese el nombre del nuevo usuario"} id={"nombre"} onChange={(event) => setNombre(event.target.value)}></Input>
                    <br /><br />
                    <Input color={"registro"} type={"password"} placeholder={"Ingrese la contraseña"} id={"contraseña"} onChange={(event) => setContraseña(event.target.value)}></Input>
                    <br /><br />
                    <Input color={"registro"} type={"text"} placeholder={"Ingrese el mail"} id={"mail"} onChange={(event) => setMail(event.target.value)}></Input>
                    <br /><br />
                    <Input color={"registro"} type={"text"} placeholder={"Ingrese 1 para admin y 0 para usuario jugador"} id={"esAdmin"} onChange={(event) => setEsAdmin(event.target.value)}></Input>
                    <br /><br />
                    <Boton1 type={"text"} texto={"Subir Usuario<"} color={"wpp"} onClick={subirUsuario}>Agregar Usuario</Boton1>
                </div>
                <br></br>
                <br></br>
                <div className={styles.container}>
                    <Title texto="Eliminar usuario" color={"registro"} /><h3></h3><br />
                    <Input color={"registro"} type={"text"} placeholder={"Ingrese el nombre del usuario que desea eliminar"} id={"nombreEliminado"} onChange={(event) => setNombreEliminado(event.target.value)}></Input>
                    <br /><br />
                    <Boton1 type={"text"} texto={"Eliminar Usuario"} color={"wpp"} onClick={eliminarUsuariosAdmin}>Eliminar Usuario</Boton1>
                </div>
            </div>
        </>
    )
}