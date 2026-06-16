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
import { toast } from "sonner";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { data: appointments, refetch } = trpc.appointments.list.useQuery();
  const { data: patients } = trpc.patients.list.useQuery();
  const { data: professionals } = trpc.professionals.list.useQuery();
  const createMutation = trpc.appointments.create.useMutation();
  const updateMutation = trpc.appointments.update.useMutation();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    patientId: "",
    professionalId: "",
    appointmentDate: "",
    status: "agendado" as "agendado" | "realizado" | "cancelado",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          status: formData.status,
          notes: formData.notes,
        });
        toast.success("Agendamento atualizado com sucesso");
      } else {
        await createMutation.mutateAsync({
          patientId: parseInt(formData.patientId),
          professionalId: parseInt(formData.professionalId),
          appointmentDate: new Date(formData.appointmentDate),
          notes: formData.notes,
        });
        toast.success("Agendamento criado com sucesso");
      }

      setOpen(false);
      setEditingId(null);
      setFormData({
        patientId: "",
        professionalId: "",
        appointmentDate: "",
        status: "agendado",
        notes: "",
      });
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar agendamento");
    }
  };

  const handleEdit = (appointment: any) => {
    setFormData({
      patientId: appointment.patientId.toString(),
      professionalId: appointment.professionalId.toString(),
      appointmentDate: appointment.appointmentDate.split("T")[0],
      status: appointment.status,
      notes: appointment.notes || "",
    });
    setEditingId(appointment.id);
    setOpen(true);
  };

  const isAdmin = user?.role === "admin";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Agendamentos</h1>
            <p className="text-slate-600 mt-1">Gerenciar agendamentos de atendimentos</p>
          </div>
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Editar" : "Novo"} Agendamento</DialogTitle>
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
                      <Label>Data e Hora</Label>
                      <Input
                        type="datetime-local"
                        value={formData.appointmentDate}
                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                        required
                      />
                    </div>
                    {editingId && (
                      <div>
                        <Label>Status</Label>
                        <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agendado">Agendado</SelectItem>
                            <SelectItem value="realizado">Realizado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className={editingId ? "col-span-2" : ""}>
                      <Label>Observações</Label>
                      <Input
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

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {appointments && appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((apt: any) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Agendamento #{apt.id}</p>
                      <p className="text-sm text-slate-600">
                        {new Date(apt.appointmentDate).toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {apt.notes && <p className="text-sm text-slate-600 mt-1">{apt.notes}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          apt.status === "agendado"
                            ? "bg-blue-100 text-blue-700"
                            : apt.status === "realizado"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {apt.status}
                      </span>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(apt)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">Nenhum agendamento encontrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
