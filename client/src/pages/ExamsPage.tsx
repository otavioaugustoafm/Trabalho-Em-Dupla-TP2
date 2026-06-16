import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Plus, Edit2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ExamsPage() {
  const { user } = useAuth();
  const { data: exams, refetch } = trpc.labExams.list.useQuery();
  const { data: patients } = trpc.patients.list.useQuery();
  const { data: professionals } = trpc.professionals.list.useQuery();
  const { data: appointments } = trpc.appointments.list.useQuery();

  const createMutation = trpc.labExams.create.useMutation();
  const updateMutation = trpc.labExams.update.useMutation();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    appointmentId: "",
    patientId: "",
    professionalId: "",
    examType: "",
    status: "pendente" as "pendente" | "realizado" | "cancelado",
    result: "",
    resultDate: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          status: formData.status,
          result: formData.result,
          resultDate: formData.resultDate ? new Date(formData.resultDate) : undefined,
          notes: formData.notes,
        });
        toast.success("Exame atualizado com sucesso");
      } else {
        await createMutation.mutateAsync({
          appointmentId: formData.appointmentId ? parseInt(formData.appointmentId) : undefined,
          patientId: parseInt(formData.patientId),
          professionalId: parseInt(formData.professionalId),
          examType: formData.examType,
          notes: formData.notes,
        });
        toast.success("Exame criado com sucesso");
      }

      setOpen(false);
      setEditingId(null);
      setFormData({
        appointmentId: "",
        patientId: "",
        professionalId: "",
        examType: "",
        status: "pendente",
        result: "",
        resultDate: "",
        notes: "",
      });
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar exame");
    }
  };

  const handleEdit = (exam: any) => {
    setFormData({
      appointmentId: exam.appointmentId?.toString() || "",
      patientId: exam.patientId.toString(),
      professionalId: exam.professionalId.toString(),
      examType: exam.examType,
      status: exam.status,
      result: exam.result || "",
      resultDate: exam.resultDate ? exam.resultDate.split("T")[0] : "",
      notes: exam.notes || "",
    });
    setEditingId(exam.id);
    setOpen(true);
  };

  const isAdmin = user?.role === "admin";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Exames Laboratoriais</h1>
            <p className="text-slate-600 mt-1">Gerenciar solicitação e registro de exames</p>
          </div>
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Exame
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Editar" : "Novo"} Exame</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Paciente</Label>
                      <Select value={formData.patientId} onValueChange={(value) => setFormData({ ...formData, patientId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um paciente" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients?.map((p: any) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Profissional</Label>
                      <Select value={formData.professionalId} onValueChange={(value) => setFormData({ ...formData, professionalId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um profissional" />
                        </SelectTrigger>
                        <SelectContent>
                          {professionals?.map((p: any) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Agendamento (Opcional)</Label>
                      <Select value={formData.appointmentId} onValueChange={(value) => setFormData({ ...formData, appointmentId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Nenhum</SelectItem>
                          {appointments?.map((a: any) => (
                            <SelectItem key={a.id} value={a.id.toString()}>
                              #{a.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Tipo de Exame</Label>
                      <Input
                        value={formData.examType}
                        onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                        placeholder="Ex: Hemograma, Glicemia"
                        required
                      />
                    </div>

                    {editingId && (
                      <>
                        <div>
                          <Label>Status</Label>
                          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="realizado">Realizado</SelectItem>
                              <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Data do Resultado</Label>
                          <Input
                            type="date"
                            value={formData.resultDate}
                            onChange={(e) => setFormData({ ...formData, resultDate: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    <div className={editingId ? "col-span-2" : ""}>
                      <Label>Resultado</Label>
                      <Textarea
                        value={formData.result}
                        onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                        placeholder="Resultado do exame"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Notas adicionais"
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

        {/* Exams List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Exames</CardTitle>
          </CardHeader>
          <CardContent>
            {exams && exams.length > 0 ? (
              <div className="space-y-3">
                {exams.map((exam: any) => (
                  <div key={exam.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{exam.examType}</p>
                      <p className="text-sm text-slate-600">
                        Solicitado em: {new Date(exam.requestDate).toLocaleDateString("pt-BR")}
                      </p>
                      {exam.result && <p className="text-sm text-slate-600 mt-1">Resultado: {exam.result}</p>}
                      {exam.notes && <p className="text-sm text-slate-600">{exam.notes}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          exam.status === "pendente"
                            ? "bg-yellow-100 text-yellow-700"
                            : exam.status === "realizado"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {exam.status}
                      </span>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(exam)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">Nenhum exame encontrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
