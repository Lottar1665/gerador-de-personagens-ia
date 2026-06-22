"use client"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocialButtons } from "@/components/social-buttons"

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
              Gere parâmetros de rosto para o EA FC em segundos.
            </p>
          </div>
        </div>

        <Card className="border-border bg-card shadow-xl">
          <Tabs defaultValue="login" className="gap-0">
            <CardHeader className="pb-4">
              <TabsList className="w-full bg-secondary/60">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* LOGIN */}
              <TabsContent value="login">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg">Bem-vindo de volta</CardTitle>
                    <CardDescription>
                      Acesse sua conta para gerar e salvar seus personagens.
                    </CardDescription>
                  </div>

                  <SocialButtons />
                  <EmailDivider />

                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="voce@email.com"
                        autoComplete="email"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="login-password">Senha</FieldLabel>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                      />
                    </Field>
                  </FieldGroup>

                  <Button size="lg" className="h-11 w-full font-semibold">
                    Entrar
                  </Button>
                </div>
              </TabsContent>

              {/* SIGN UP */}
              <TabsContent value="signup">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg">Criar uma conta</CardTitle>
                    <CardDescription>
                      Comece a criar personagens incríveis com IA.
                    </CardDescription>
                  </div>

                  <FieldGroup className="gap-4">
                    <Field>
                      <FieldLabel htmlFor="signup-login">
                        Nome de Login
                      </FieldLabel>
                      <Input
                        id="signup-login"
                        placeholder="seu_nick"
                        autoComplete="username"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="signup-email">E-mail</FieldLabel>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="voce@email.com"
                        autoComplete="email"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="signup-birth">
                        Data de Nascimento
                      </FieldLabel>
                      <Input id="signup-birth" type="date" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="signup-password">Senha</FieldLabel>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="signup-password-2">
                        Repetir Senha
                      </FieldLabel>
                      <Input
                        id="signup-password-2"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                    </Field>
                  </FieldGroup>

                  <Button size="lg" className="h-11 w-full font-semibold">
                    Criar Conta
                  </Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
