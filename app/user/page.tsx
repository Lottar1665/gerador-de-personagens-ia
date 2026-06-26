"use client";

import { useState } from "react";

type Tab = "presets" | "profile" | "security" | "privacy";

const SAVED = [
  { emoji: "🧑🏾", name: "Meu jogador 1",      date: "há 2 dias",   ovr: 87 },
  { emoji: "🧑🏼", name: "Versão alternativa", date: "há 1 semana", ovr: 83 },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>("presets");
  const [sharePresets, setSharePresets] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  const sidebarItems: { id: Tab; icon: string; label: string }[] = [
    { id: "presets",  icon: "🎮", label: "Meus presets" },
    { id: "profile",  icon: "👤", label: "Perfil" },
    { id: "security", icon: "🔒", label: "Segurança" },
    { id: "privacy",  icon: "👁️", label: "Privacidade" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-black tracking-tight text-fc-text mb-1">Minha área</h1>
      <p className="text-fc-text2 text-sm mb-6">Gerencie seu perfil e presets salvos</p>

      <div className="grid md:grid-cols-[220px_1fr] gap-5">
        {/* Sidebar */}
        <div className="card h-fit">
          {/* User info */}
          <div className="text-center pb-4 border-b border-fc mb-4">
            <div className="w-16 h-16 rounded-full bg-fc-green-dim border-[3px] border-fc-green flex items-center justify-center text-2xl font-bold text-fc-green mx-auto mb-2.5">
              LA
            </div>
            <div className="text-fc-text font-bold text-sm">Lottar</div>
            <div className="text-fc-text3 text-xs">lottar@email.com</div>
          </div>

          {/* Menu */}
          <div className="flex flex-col gap-0.5">
            {sidebarItems.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-all duration-150 cursor-pointer border-none ${
                  tab === id
                    ? "bg-fc-green-dim text-fc-green font-semibold"
                    : "text-fc-text2 hover:bg-fc-bg3 hover:text-fc-text bg-transparent"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </button>
            ))}

            <div className="h-px bg-fc-border my-2" />

            <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm w-full text-left text-red-400 hover:bg-red-900/20 transition-all duration-150 cursor-pointer border-none bg-transparent">
              <span className="text-base">🚪</span>
              Sair
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Presets */}
          {tab === "presets" && (
            <div className="card">
              <h3 className="text-fc-text font-bold text-base mb-4">Presets salvos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SAVED.map(({ emoji, name, date, ovr }, i) => (
                  <div
                    key={i}
                    className="bg-fc-bg3 border border-fc rounded-xl p-4 text-center cursor-pointer hover:border-fc-green transition-colors"
                  >
                    <div className="text-4xl mb-2">{emoji}</div>
                    <div className="text-fc-text font-semibold text-sm">{name}</div>
                    <div className="text-fc-text3 text-xs mt-0.5">{date}</div>
                    <span className="inline-block bg-fc-green text-black text-xs font-black px-2 py-0.5 rounded mt-2">
                      {ovr}
                    </span>
                  </div>
                ))}
                <a
                  href="/generator"
                  className="bg-fc-bg3 border-2 border-dashed border-fc2 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-fc-green transition-colors min-h-[120px] no-underline"
                >
                  <span className="text-3xl text-fc-text3 mb-1.5">＋</span>
                  <span className="text-fc-text3 text-xs font-medium">Novo preset</span>
                </a>
              </div>
            </div>
          )}

          {/* Profile */}
          {tab === "profile" && (
            <div className="card">
              <h3 className="text-fc-text font-bold text-base mb-4">Informações do perfil</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-fc-text2 text-xs font-semibold mb-1.5">
                    Nome de exibição
                  </label>
                  <input className="input" defaultValue="Lottar" />
                </div>
                <div>
                  <label className="block text-fc-text2 text-xs font-semibold mb-1.5">
                    Username
                  </label>
                  <input className="input" defaultValue="@lottar1665" />
                </div>
                <div>
                  <label className="block text-fc-text2 text-xs font-semibold mb-1.5">
                    Bio
                  </label>
                  <input className="input" placeholder="Conte algo sobre você..." />
                </div>
                <button className="btn-primary w-fit">Salvar alterações</button>
              </div>
            </div>
          )}

          {/* Security */}
          {tab === "security" && (
            <div className="card">
              <h3 className="text-fc-text font-bold text-base mb-4">Segurança</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-fc-text2 text-xs font-semibold mb-1.5">
                    Senha atual
                  </label>
                  <input className="input" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-fc-text2 text-xs font-semibold mb-1.5">
                    Nova senha
                  </label>
                  <input className="input" type="password" placeholder="••••••••" />
                  <div className="h-1 bg-fc-border rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full w-[65%] bg-fc-green rounded-full" />
                  </div>
                  <span className="text-fc-green text-xs mt-1 block">Senha forte</span>
                </div>
                <div>
                  <label className="block text-fc-text2 text-xs font-semibold mb-1.5">
                    Confirmar nova senha
                  </label>
                  <input className="input" type="password" placeholder="••••••••" />
                </div>
                <button className="btn-primary w-fit">Redefinir senha</button>
              </div>
            </div>
          )}

          {/* Privacy */}
          {tab === "privacy" && (
            <div className="card">
              <h3 className="text-fc-text font-bold text-base mb-4">Privacidade</h3>
              <div className="flex flex-col gap-3">
                {[
                  {
                    label: "Compartilhar presets na comunidade",
                    desc: "Seus presets aparecerão para outros usuários",
                    value: sharePresets,
                    toggle: () => setSharePresets((v) => !v),
                  },
                  {
                    label: "Perfil público",
                    desc: "Qualquer pessoa pode ver seu perfil",
                    value: publicProfile,
                    toggle: () => setPublicProfile((v) => !v),
                  },
                ].map(({ label, desc, value, toggle }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 p-4 bg-fc-bg3 border border-fc rounded-xl"
                  >
                    <div>
                      <div className="text-fc-text font-semibold text-sm">{label}</div>
                      <div className="text-fc-text3 text-xs mt-0.5">{desc}</div>
                    </div>
                    <button
                      onClick={toggle}
                      role="switch"
                      aria-checked={value}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer border-none flex-shrink-0 ${
                        value ? "bg-fc-green" : "bg-fc-border2"
                      }`}
                    >
                      <span
                        className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full transition-all duration-200 ${
                          value ? "right-[3px]" : "left-[3px]"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
