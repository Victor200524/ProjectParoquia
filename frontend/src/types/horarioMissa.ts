import { Comunidade } from "./comunidade";

export interface HorarioMissa {
    idHorarioMissa?: number;
    semanaMissa: string;
    horarioMissa: string;
    comunidade: Comunidade;
}
