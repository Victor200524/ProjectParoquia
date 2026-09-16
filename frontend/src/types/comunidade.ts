import { HorarioMissa } from "./horarioMissa";

export interface Comunidade{
    idComunidade: number,
    nomeComunidade?: string,
    enderecoComunidade?: string,
    contatoComunidade?: string,
    fotoComunidade?: string,
    horariosMissa?: HorarioMissa[],
}