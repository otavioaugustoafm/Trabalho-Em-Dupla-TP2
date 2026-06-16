import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Heart, Users, Calendar, FileText, Beaker } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-rose-500" />
            <span className="text-2xl font-bold text-slate-900">ClinicaHub</span>
          </div>
          <Button onClick={() => setLocation("/dashboard")}>
            Entrar
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
          Gestão Clínica Elegante e Completa
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Um sistema profissional para gerenciar profissionais de saúde, pacientes, agendamentos e prescrições com elegância e segurança.
        </p>
        <Button size="lg" onClick={() => setLocation("/dashboard")} className="bg-rose-500 hover:bg-rose-600 text-white">
          Começar Agora
        </Button>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Funcionalidades Principais</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Profissionais */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Profissionais</h3>
            <p className="text-sm text-slate-600">Gerenciar Médicos, Fisioterapeutas e Psicólogos com dados específicos</p>
          </div>

          {/* Pacientes */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Pacientes</h3>
            <p className="text-sm text-slate-600">Cadastro completo com dados pessoais e histórico</p>
          </div>

          {/* Agendamentos */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Agendamentos</h3>
            <p className="text-sm text-slate-600">Agendar e gerenciar atendimentos com status</p>
          </div>

          {/* Prescrições */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Prescrições</h3>
            <p className="text-sm text-slate-600">Prescrições médicas, planos de reabilitação e evoluções</p>
          </div>

          {/* Exames */}
          <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Beaker className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Exames</h3>
            <p className="text-sm text-slate-600">Solicitação e registro de exames laboratoriais</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-rose-500 to-rose-600 py-16 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg mb-8 opacity-90">Acesse o sistema e comece a gerenciar sua clínica com elegância.</p>
          <Button size="lg" variant="secondary" onClick={() => setLocation("/dashboard")}>
            Entrar no Sistema
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400">© 2024 ClinicaHub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
