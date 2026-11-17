'use client';

import { useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import styles from './recorteFoto.module.css';

// Tela de recorte da foto: a pessoa arrasta a imagem e ajusta o zoom dentro de um quadrado.
// Ao confirmar, devolve a foto já recortada em JPEG, como texto base64 (é assim que o Java recebe o byte[]).

interface RecorteFotoProps {
    imagem: string;                              // a foto escolhida, lida como "data:image/...;base64,..."
    onConfirmar: (fotoBase64: string) => void;
    onCancelar: () => void;
}

const TAMANHO_FINAL = 400; // a foto salva fica com 400x400 pixels (leve e suficiente para impressão)

export default function RecorteFoto({ imagem, onConfirmar, onCancelar }: RecorteFotoProps) {
    const [posicao, setPosicao] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [areaRecorte, setAreaRecorte] = useState<Area | null>(null); // o pedaço da imagem original que está dentro do quadrado

    async function confirmar() {
        if (!areaRecorte)
            return;

        // 1º carrega a imagem original
        const img = new Image();
        img.src = imagem;
        await img.decode();

        // 2º desenha só o pedaço escolhido num canvas de 400x400
        const canvas = document.createElement('canvas');
        canvas.width = TAMANHO_FINAL;
        canvas.height = TAMANHO_FINAL;
        const contexto = canvas.getContext('2d');
        if (!contexto)
            return;
        contexto.drawImage(
            img,
            areaRecorte.x, areaRecorte.y, areaRecorte.width, areaRecorte.height, // pedaço da original
            0, 0, TAMANHO_FINAL, TAMANHO_FINAL                                    // onde desenhar no canvas
        );

        // 3º transforma em JPEG e tira o começo "data:image/jpeg;base64," (o Java quer só o base64)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onConfirmar(dataUrl.split(',')[1]);
    }

    return (
        <div className={styles.fundo}>
            <div className={styles.janela}>
                <h2 className={styles.titulo}>Ajuste sua foto</h2>
                <p className={styles.dica}>Arraste para posicionar e use o controle para aproximar.</p>

                <div className={styles.areaCorte}>
                    <Cropper
                        image={imagem}
                        crop={posicao}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setPosicao}
                        onZoomChange={setZoom}
                        onCropComplete={(_, pixels) => setAreaRecorte(pixels)}
                    />
                </div>

                <label className={styles.zoomLabel}>
                    Zoom
                    <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                </label>

                <div className={styles.botoes}>
                    <button type="button" className={styles.btnCancelar} onClick={onCancelar}>Cancelar</button>
                    <button type="button" className={styles.btnConfirmar} onClick={confirmar}>Usar esta foto</button>
                </div>
            </div>
        </div>
    );
}
