import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

type Mode = "login" | "register";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [needsSetup, setNeedsSetup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/setup-status")
      .then((r) => r.json())
      .then((data) => {
        if (data.needsSetup) {
          setNeedsSetup(true);
          setMode("register");
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Preencha email e senha.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Preencha o nome.");
      return;
    }
    if (mode === "register" && password.length < 6) {
      setError("A senha deve ter ao menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body: Record<string, string> = { email, password };
      if (mode === "register") body.name = name;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro desconhecido.");
        return;
      }

      setLocation("/dashboard");
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const isRegister = mode === "register";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="w-8 h-8 text-rose-500" />
          <span className="text-2xl font-bold text-slate-900">ClinicaHub</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isRegister ? "Criar conta de administrador" : "Entrar"}</CardTitle>
            <CardDescription>
              {isRegister
                ? needsSetup
                  ? "Nenhum administrador encontrado. Crie o primeiro acesso."
                  : "Registre um novo usuário."
                : "Acesse o sistema com suas credenciais."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder={isRegister ? "Mínimo 6 caracteres" : "Sua senha"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <Button
              className="w-full bg-rose-500 hover:bg-rose-600 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Aguarde..." : isRegister ? "Criar conta" : "Entrar"}
            </Button>

            {!needsSetup && (
              <p className="text-sm text-center text-slate-500">
                {isRegister ? (
                  <>
                    Já tem conta?{" "}
                    <button
                      className="text-rose-500 hover:underline"
                      onClick={() => { setMode("login"); setError(""); }}
                    >
                      Entrar
                    </button>
                  </>
                ) : (
                  <>
                    Primeiro acesso?{" "}
                    <button
                      className="text-rose-500 hover:underline"
                      onClick={() => { setMode("register"); setError(""); }}
                    >
                      Criar conta
                    </button>
                  </>
                )}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
