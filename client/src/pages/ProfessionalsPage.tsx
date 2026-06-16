import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ProfessionalsPage() {
  const { user } = useAuth();
  const { data: professionals, refetch } = trpc.professionals.list.useQuery();
  const createMutation = trpc.professionals.create.useMutation();
  const updateMutation = trpc.professionals.update.useMutation();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "medico" as "medico" | "fisioterapeuta" | "psicologo",
    crm: "",
    specialty: "",
    crefito: "",
    crp: "",
    bio: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("Profissional atualizado com sucesso");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Profissional criado com sucesso");
      }

      setOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "medico",
        crm: "",
        specialty: "",
        crefito: "",
        crp: "",
        bio: "",
      });
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar profissional");
    }
  };

  const handleEdit = (professional: any) => {
    setFormData(professional);
    setEditingId(professional.id);
    setOpen(true);
  };

  const isAdmin = user?.role === "admin";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Profissionais de Saúde</h1>
            <p className="text-slate-600 mt-1">Gerenciar médicos, fisioterapeutas e psicólogos</p>
          </div>
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Profissional
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Editar" : "Novo"} Profissional</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nome</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Categoria</Label>
                      <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medico">Médico</SelectItem>
                          <SelectItem value="fisioterapeuta">Fisioterapeuta</SelectItem>
                          <SelectItem value="psicologo">Psicólogo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.category === "medico" && (
                      <>
                        <div>
                          <Label>CRM</Label>
                          <Input
                            value={formData.crm}
                            onChange={(e) => setFormData({ ...formData, crm: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Especialidade</Label>
                          <Input
                            value={formData.specialty}
                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {formData.category === "fisioterapeuta" && (
                      <div>
                        <Label>CREFITO</Label>
                        <Input
                          value={formData.crefito}
                          onChange={(e) => setFormData({ ...formData, crefito: e.target.value })}
                        />
                      </div>
                    )}

                    {formData.category === "psicologo" && (
                      <div>
                        <Label>CRP</Label>
                        <Input
                          value={formData.crp}
                          onChange={(e) => setFormData({ ...formData, crp: e.target.value })}
                        />
                      </div>
                    )}

                    <div className="col-span-2">
                      <Label>Bio</Label>
                      <Input
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Descrição profissional"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {createMutation.isPending || updateMutation.isPending ? "Salvando..." : "Salvar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Professionals List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Profissionais</CardTitle>
          </CardHeader>
          <CardContent>
            {professionals && professionals.length > 0 ? (
              <div className="space-y-3">
                {professionals.map((prof: any) => (
                  <div key={prof.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{prof.name}</p>
                      <p className="text-sm text-slate-600">{prof.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {prof.category === "medico"
                            ? `Médico - ${prof.specialty}`
                            : prof.category === "fisioterapeuta"
                              ? "Fisioterapeuta"
                              : "Psicólogo"}
                        </span>
                        {prof.crm && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">CRM: {prof.crm}</span>}
                        {prof.crefito && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">CREFITO: {prof.crefito}</span>}
                        {prof.crp && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">CRP: {prof.crp}</span>}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(prof)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">Nenhum profissional cadastrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
