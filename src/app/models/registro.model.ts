import { Producto } from "../services/producto.service";

export interface RegistroItem {
    producto_id: number;
    cantidad: number;
    precio: number;
    producto: Producto;
}

export interface Registro {
    id: number;
    mesa: number;
    garzon?: string | null;
    personas: number;
    total: number;
    propina: number;
    total_final: number;
    fecha: string;       // ISO
    usuario_id: number;
    items: RegistroItem[];
}