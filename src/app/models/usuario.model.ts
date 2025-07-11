export interface UsuarioRegistro {
    nombre: string;
    correo: string;
    contrasena: string;
}

export interface UsuarioLogin {
    correo: string;
    contrasena: string;
}

export interface UsuarioRespuesta {
    token: string;
    usuario: { id: number; correo: string; nombre: string };
}