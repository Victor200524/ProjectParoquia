import { Comunidade } from "./comunidade";

export interface HorarioMissa {
    idHorarioMissa?: number;
    semanaMissa: string;
    horarioMissa: string;
    comunidade?: Comunidade; // o backend não manda (JsonIgnore); o horário vai dentro da comunidade
}
