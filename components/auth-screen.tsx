"use client"

import { useState, useEffect } from "react" // 🟢 Adicionado useEffect
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect, // 🟢 Trocado popup por redirect
  getRedirectResult,   // 🟢 Adicionado para capturar o retorno
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SocialButtons } from "@/components/social-buttons"
import { auth } from "@/lib/firebase"
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  normalizeAuthEmail,
} from "@/lib/auth"

function EmailDivider() {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        ou continue com e-mail
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 🟢 NOVO: Captura o usuário automaticamente assim que ele retorna do redirecionamento do Google
  useEffect(() => {
    if (auth) {
      setIsLoading(true)
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            console.log("Usuário autenticado via redirecionamento:", result.user)
          }
        })
        .catch((redirectError: any) => {
          console.error("Erro no retorno do login social:", redirectError)
          setError(`Erro ao processar login social: ${redirectError?.message || "Erro interno"}`)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [])

  // 🟢 BLINDADO: Agora redireciona a página em vez de abrir pop-up travado
  const providerSignIn = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
    if (!auth) {
      setError("Firebase auth não está disponível no navegador.")
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      await signInWithRedirect(auth, provider) // 🛠️ Método alterado para evitar o erro Cross-Origin
    } catch (popupError: any) {
      console.error(popupError)
      setError(
        `Falha no login social (${popupError?.code || "erro desconhecido"}). Tente novamente.`,
      )
      setIsLoading(false)
    }
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!auth) {
      setError("Firebase auth não está disponível no navegador.")
      return
    }

    setError(null)
    setIsLoading(true)

    const normalizedEmail = normalizeAuthEmail(email)
    const isAdminAttempt =
      normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD

    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, normalizedEmail, password)
      } else {
        await signInWithEmailAndPassword(auth, normalizedEmail, password)
      }
    } catch (loginError: any) {
      console.error(loginError)

      if (
        mode === "login" &&
        isAdminAttempt &&
        ["auth/user-not-found", "auth/invalid-credential"].includes(
          loginError?.code,
        )
      ) {
        try {
          await createUserWithEmailAndPassword(auth, normalizedEmail, password)
          return
        } catch (createError: any) {
          console.error(createError)
          setError(
            `Não foi possível criar a conta de admin: ${createError?.code || createError?.message || "erro desconhecido"}`,
          )
          return
        }
      }

      if (mode === "register" && loginError?.code === "auth/email-already-in-use") {
        setError("Este e-mail já está em uso. Faça login ou use outro e-mail.")
      } else {
        setError(
          
          mode === "register"
            ? `Falha ao criar a conta (${loginError?.code || "erro desconhecido"}). Verifique os dados.`
            : `Falha ao efetuar login (${loginError?.code || "erro desconhecido"}). Verifique o e-mail e a senha e tente novamente.`,
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_30px_-6px_var(--primary)]">
            <Sparkles className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-balance">
              Crie seu char com IA
            </h1>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Faça login para acessar sua área de usuário ou administrador.
            </p>
          </div>
        </div>

        <Card className="border-border bg-card shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{mode === "login" ? "Entrar" : "Criar conta"}</CardTitle>
            <CardDescription>
              Use sua conta do Firebase. Conta de admin: <strong>admin</strong> / <strong>12345678</strong>.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 p-1 text-xs text-muted-foreground">
                <button
                  type="button"
                  className={
                    "flex-1 rounded-full py-2 font-semibold transition-colors " +
                    (mode === "login" ? "bg-background text-foreground" : "hover:bg-background/80")
                  }
                  onClick={() => setMode("login")}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  className={
                    "flex-1 rounded-full py-2 font-semibold transition-colors " +
                    (mode === "register" ? "bg-background text-foreground" : "hover:bg-background/80")
                  }
                  onClick={() => setMode("register")}
                >
                  Cadastrar
                </button>
              </div>

              <SocialButtons
                onGoogle={() => providerSignIn(new GoogleAuthProvider())}
                onFacebook={() => providerSignIn(new FacebookAuthProvider())}
              />
            </div>

            <form className="mt-4 flex flex-col gap-5" onSubmit={handleLogin}>
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg">
                  {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
                </CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Acesse sua conta para gerar e salvar seus personagens."
                    : "Cadastre-se com e-mail e senha para começar."}
                </CardDescription>
              </div>

              <EmailDivider />

              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel htmlFor="login-email">E-mail ou usuário</FieldLabel>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="login-password">Senha</FieldLabel>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Field>
              </FieldGroup>

              {error ? (
                <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              ) : null}

              <Button size="lg" className="h-11 w-full font-semibold" type="submit" disabled={isLoading}>
                {isLoading ? (mode === "login" ? "Entrando..." : "Criando conta...") : (mode === "login" ? "Entrar" : "Cadastrar")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
