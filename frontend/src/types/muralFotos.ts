export interface MuralFotos {
    idMuralFotos?: number;
    tituloMuralFotos: string;
    dataEventoMuralFotos: string;
    linkDriveMuralFotos: string;
    acampamento: {
        idAcampamento: number;
        nomeAcampamento?: string; // o nome só vem nas listagens
    };
}
