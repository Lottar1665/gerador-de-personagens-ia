import Link from "next/link";

const stats = [
  { num: "12.4k", label: "Jogadores criados" },
  { num: "3.8k", label: "Usuários ativos" },
  { num: "98%", label: "Precisão facial" },
  { num: "4.9★", label: "Avaliação" },
];

const features = [
  {
    icon: "📸",
    title: "Envie sua foto",
    desc: "Faça upload de qualquer foto com o rosto visível — nosso sistema cuida do resto.",
  },
  {
    icon: "🤖",
    title: "IA analisa seu rosto",
    desc: "MediaPipe mapeia 468 pontos faciais e o Gemini traduz em atributos de jogador únicos.",
  },
  {
    icon: "🎮",
    title: "Importe no EA FC 2026",
    desc: "Exporte os dados do preset e use diretamente na criação de personagem do jogo.",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Hero */}
      <section className="text-center py-16 pb-12">
        <div className="inline-flex items-center gap-1.5 bg-fc-green-dim text-fc-green text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-fc-green-dim tracking-wide">
          ⚽ EA FC 2026 · IA + MediaPipe + Gemini
        </div>
        <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] mb-4 tracking-tight text-fc-text">
          Crie seu{" "}
          <span className="text-fc-green">jogador</span>
          <br />
          com o seu rosto
        </h1>
        <p className="text-fc-text2 text-lg max-w-xl mx-auto mb-9 leading-relaxed">
          Envie uma foto, nossa IA analisa seu rosto com MediaPipe e gera um
          preset personalizado para o EA FC 2026.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/dashboard" className="btn-primary">
            Criar meu jogador
          </Link>
          <Link href="/community" className="btn-secondary">
            Ver comunidade
          </Link>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-12">
        {stats.map(({ num, label }) => (
          <div key={label} className="card text-center py-5">
            <div className="text-fc-green text-3xl font-black">{num}</div>
            <div className="text-fc-text2 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <p className="section-eyebrow mb-4">Como funciona</p>
      <div className="grid sm:grid-cols-3 gap-4">
        {features.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="card hover:border-fc-green transition-colors duration-200"
          >
            <div className="w-11 h-11 bg-fc-green-dim rounded-lg flex items-center justify-center text-2xl mb-3.5">
              {icon}
            </div>
            <h3 className="text-fc-text font-bold text-sm mb-2">{title}</h3>
            <p className="text-fc-text2 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
