// app/dev-calibracao/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function PaginaCalibracao() {
  const [status, setStatus] = useState('Carregando MediaPipe Local...');
  const [landmarker, setLandmarker] = useState<any>(null);

  useEffect(() => {
    async function inicializar() {
      try {
        const { FilesetResolver, FaceLandmarker } = await import('@mediapipe/tasks-vision');
        
        // 1. CARREGAMENTO 100% LOCAL: Alinhado com a pasta public/wasm
        const vision = await FilesetResolver.forVisionTasks('/wasm');
        
        // 2. Modelo também pode ser carregado localmente se você colocá-lo em public/model/
        const instance = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/wasm/face_landmarker.task',
            delegate: 'CPU'
          },
          runningMode: 'IMAGE',
          numFaces: 1
        });
        
        setLandmarker(instance);
        setStatus('MediaPipe Pronto Localmente! Insira seus prints.');
      } catch (err) {
        console.error("Erro na inicialização do MediaPipe:", err);
        setStatus('Erro ao carregar arquivos locais. Verifique o console.');
      }
    }
    inicializar();
  }, []);

  const analisarImagem = (tipo: 'frente' | 'perfil', sliderId: number) => {
    const input = document.getElementById(`input-${tipo}-${sliderId}`) as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return alert('Selecione a imagem primeiro!');

    const file = input.files[0];
    const imgElement = document.createElement('img');
    imgElement.src = URL.createObjectURL(file);

    imgElement.onload = async () => {
      try {
        if (!landmarker) return alert('O MediaPipe ainda não está pronto.');

        const resultado = landmarker.detect(imgElement);
        if (!resultado.faceLandmarks || resultado.faceLandmarks.length === 0) {
          return alert('Nenhum rosto detectado neste print.');
        }

        const pontos = resultado.faceLandmarks[0];

        // --- FUNÇÃO AUXILIAR: DISTÂNCIA EUCLIDIANA 3D ---
        const dist3D = (p1: any, p2: any) => {
          return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
        };

        // --- CALIBRADOR DE ÂNCORA UNIVERSAL (DIP) ---
        const dip = dist3D(pontos[133], pontos[362]);

        console.log(`\n======================================================`);
        console.log(`--- DADOS EXTRAÍDOS: PRINT ${tipo.toUpperCase()} SLIDER ${sliderId} ---`);
        console.log(`======================================================`);

        if (tipo === 'frente') {
          // --- MÉTRICAS DE FRENTE (Morfologia e Larguras) ---
          const larguraNariz = dist3D(pontos[61], pontos[291]) / dip;
          const larguraBoca = dist3D(pontos[57], pontos[287]) / dip;
          const larguraMaxilar = dist3D(pontos[172], pontos[397]) / dip;
          const alturaOlhoEsquerdo = dist3D(pontos[159], pontos[145]) / dip;
          const distanciaSobrancelhaOlho = dist3D(pontos[70], pontos[159]) / dip;

          console.log(`>> [ESQUELETO] Largura do Maxilar (Normalizada): ${larguraMaxilar.toFixed(4)}`);
          console.log(`>> [ESQUELETO] Distância Sobrancelha ao Olho: ${distanciaSobrancelhaOlho.toFixed(4)}`);
          console.log(`>> [PREENCHIMENTO] Largura do Nariz: ${larguraNariz.toFixed(4)}`);
          console.log(`>> [PREENCHIMENTO] Largura da Boca: ${larguraBoca.toFixed(4)}`);
          console.log(`>> [OLHOS] Abertura Vertical da Pálpebra: ${alturaOlhoEsquerdo.toFixed(4)}`);
        } else {
          // --- MÉTRICAS DE PERFIL (Projeções e Eixo Z) ---
          const projecaoNariz = Math.abs(pontos[4].x - pontos[6].x); 
          const projecaoQueixo = Math.abs(pontos[152].x - pontos[10].x); 
          const projecaoTesta = Math.abs(pontos[10].z - pontos[1].z); 

          console.log(`>> [ESQUELETO] Projeção da Testa (Eixo Z): ${projecaoTesta.toFixed(4)}`);
          console.log(`>> [ESQUELETO] Projeção do Queixo (Eixo X): ${projecaoQueixo.toFixed(4)}`);
          console.log(`>> [PREENCHIMENTO] Projeção/Tamanho do Nariz (Eixo X): ${projecaoNariz.toFixed(4)}`);
        }

        alert(`Métricas do print de ${tipo} (Slider ${sliderId}) calculadas! Verifique o console (F12).`);
      } catch (err) {
        console.error("Erro ao processar imagem:", err);
      }
    };
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1>Painel de Calibração Interna - EA FC Sliders</h1>
      <p><strong>Status do Sistema:</strong> <span style={{ color: landmarker ? '#4caf50' : '#ff9800' }}>{status}</span></p>

      {landmarker && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
          <h3>Seção 1: Prints de Frente (Larguras e Alturas)</h3>
          {['0', '50', '100'].map((slider) => (
            <div key={`f-${slider}`} style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px' }}>
              <label style={{ marginRight: '10px' }}>Print Frente Slider {slider}: </label>
              <input type="file" id={`input-frente-${slider}`} accept="image/*" style={{ marginRight: '10px' }} />
              <button onClick={() => analisarImagem('frente', parseInt(slider))} style={{ padding: '5px 15px', cursor: 'pointer' }}>Analisar Métricas</button>
            </div>
          ))}

          <h3 style={{ marginTop: '20px' }}>Seção 2: Prints de Perfil (Projeções e Profundidades)</h3>
          {['0', '50', '100'].map((slider) => (
            <div key={`p-${slider}`} style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px' }}>
              <label style={{ marginRight: '10px' }}>Print Perfil Slider {slider}: </label>
              <input type="file" id={`input-perfil-${slider}`} accept="image/*" style={{ marginRight: '10px' }} />
              <button onClick={() => analisarImagem('perfil', parseInt(slider))} style={{ padding: '5px 15px', cursor: 'pointer' }}>Analisar Métricas</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
