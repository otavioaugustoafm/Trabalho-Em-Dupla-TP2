import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Plus, Edit2, X } from "lucide-react";
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

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Exercise {
  name: string;
  description: string;
  repetitions: number;
  frequency: string;
}

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const { data: prescriptions, refetch: refetchPrescriptions } = trpc.medicalPrescriptions.list.useQuery();
  const { data: rehabilitations, refetch: refetchRehab } = trpc.rehabilitationPlans.list.useQuery();
  const { data: evolutions, refetch: refetchEvolutions } = trpc.sessionEvolutions.list.useQuery();
  const { data: appointments } = trpc.appointments.list.useQuery();
  const { data: patients } = trpc.patients.list.useQuery();
  const { data: professionals } = trpc.professionals.list.useQuery();

  const createPrescriptionMutation = trpc.medicalPrescriptions.create.useMutation();
  const createRehabMutation = trpc.rehabilitationPlans.create.useMutation();
  const createEvolutionMutation = trpc.sessionEvolutions.create.useMutation();

  const [activeTab, setActiveTab] = useState("medical");
  const [open, setOpen] = useState(false);

  // Medical Prescription State
  const [medicalForm, setMedicalForm] = useState({
    appointmentId: "",
    professionalId: "",
    patientId: "",
    medications: [] as Medication[],
    notes: "",
  });
  const [currentMedication, setCurrentMedication] = useState<Medication>({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  // Rehabilitation State
  const [rehabForm, setRehabForm] = useState({
    appointmentId: "",
    professionalId: "",
    patientId: "",
    diagnosis: "",
    sessions: "10",
    exercises: [] as Exercise[],
    notes: "",
  });
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: "",
    description: "",
    repetitions: 10,
    frequency: "",
  });

  // Evolution State
  const [evolutionForm, setEvolutionForm] = useState({
    appointmentId: "",
    professionalId: "",
    patientId: "",
    clinicalNotes: "",
    emotionalState: "",
    treatmentPlan: "",
  });

  const handleAddMedication = () => {
    if (currentMedication.name && currentMedication.dosage && currentMedication.frequency && currentMedication.duration) {
      setMedicalForm({
        ...medicalForm,
        medications: [...medicalForm.medications, currentMedication],
      });
      setCurrentMedication({ name: "", dosage: "", frequency: "", duration: "" });
    } else {
      toast.error("Preencha todos os campos do medicamento");
    }
  };

  const handleRemoveMedication = (index: number) => {
    setMedicalForm({
      ...medicalForm,
      medications: medicalForm.medications.filter((_, i) => i !== index),
    });
  };

  const handleAddExercise = () => {
    if (currentExercise.name && currentExercise.description && currentExercise.frequency) {
      setRehabForm({
        ...rehabForm,
        exercises: [...rehabForm.exercises, currentExercise],
      });
      setCurrentExercise({ name: "", description: "", repetitions: 10, frequency: "" });
    } else {
      toast.error("Preencha todos os campos do exercício");
    }
  };

  const handleRemoveExercise = (index: number) => {
    setRehabForm({
      ...rehabForm,
      exercises: rehabForm.exercises.filter((_, i) => i !== index),
    });
  };

  const handleSubmitPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (medicalForm.medications.length === 0) {
      toast.error("Adicione pelo menos um medicamento");
      return;
    }
    try {
      await createPrescriptionMutation.mutateAsync({
        appointmentId: parseInt(medicalForm.appointmentId),
        professionalId: parseInt(medicalForm.professionalId),
        patientId: parseInt(medicalForm.patientId),
        medications: JSON.stringify(medicalForm.medications),
        notes: medicalForm.notes,
      });
      toast.success("Prescrição médica criada com sucesso");
      setOpen(false);
      setMedicalForm({
        appointmentId: "",
        professionalId: "",
        patientId: "",
        medications: [],
        notes: "",
      });
      refetchPrescriptions();
    } catch (error) {
      toast.error("Erro ao criar prescrição");
    }
  };

  const handleSubmitRehab = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rehabForm.exercises.length === 0) {
      toast.error("Adicione pelo menos um exercício");
      return;
    }
    try {
      await createRehabMutation.mutateAsync({
        appointmentId: parseInt(rehabForm.appointmentId),
        professionalId: parseInt(rehabForm.professionalId),
        patientId: parseInt(rehabForm.patientId),
        diagnosis: rehabForm.diagnosis,
        sessions: parseInt(rehabForm.sessions),
        exercises: JSON.stringify(rehabForm.exercises),
        notes: rehabForm.notes,
      });
      toast.success("Plano de reabilitação criado com sucesso");
      setOpen(false);
      setRehabForm({
        appointmentId: "",
        professionalId: "",
        patientId: "",
        diagnosis: "",
        sessions: "10",
        exercises: [],
        notes: "",
      });
      refetchRehab();
    } catch (error) {
      toast.error("Erro ao criar plano");
    }
  };

  const handleSubmitEvolution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvolutionMutation.mutateAsync({
        appointmentId: parseInt(evolutionForm.appointmentId),
        professionalId: parseInt(evolutionForm.professionalId),
        patientId: parseInt(evolutionForm.patientId),
        clinicalNotes: evolutionForm.clinicalNotes,
        emotionalState: evolutionForm.emotionalState,
        treatmentPlan: evolutionForm.treatmentPlan,
      });
      toast.success("Evolução de sessão criada com sucesso");
      setOpen(false);
      setEvolutionForm({
        appointmentId: "",
        professionalId: "",
        patientId: "",
        clinicalNotes: "",
        emotionalState: "",
        treatmentPlan: "",
      });
      refetchEvolutions();
    } catch (error) {
      toast.error("Erro ao criar evolução");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Prescrições e Evoluções</h1>
            <p className="text-slate-600 mt-1">Gerenciar prescrições médicas, planos de reabilitação e evoluções</p>
          </div>
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Nova Prescrição
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nova Prescrição</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Paciente</Label>
                      <Select
                        value={activeTab === "medical" ? medicalForm.patientId : activeTab === "rehab" ? rehabForm.patientId : evolutionForm.patientId}
                        onValueChange={(value) => {
                          if (activeTab === "medical") setMedicalForm({ ...medicalForm, patientId: value });
                          else if (activeTab === "rehab") setRehabForm({ ...rehabForm, patientId: value });
                          else setEvolutionForm({ ...evolutionForm, patientId: value });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
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
                      <Select
                        value={activeTab === "medical" ? medicalForm.professionalId : activeTab === "rehab" ? rehabForm.professionalId : evolutionForm.professionalId}
                        onValueChange={(value) => {
                          if (activeTab === "medical") setMedicalForm({ ...medicalForm, professionalId: value });
                          else if (activeTab === "rehab") setRehabForm({ ...rehabForm, professionalId: value });
                          else setEvolutionForm({ ...evolutionForm, professionalId: value });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
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
                      <Label>Agendamento</Label>
                      <Select
                        value={activeTab === "medical" ? medicalForm.appointmentId : activeTab === "rehab" ? rehabForm.appointmentId : evolutionForm.appointmentId}
                        onValueChange={(value) => {
                          if (activeTab === "medical") setMedicalForm({ ...medicalForm, appointmentId: value });
                          else if (activeTab === "rehab") setRehabForm({ ...rehabForm, appointmentId: value });
                          else setEvolutionForm({ ...evolutionForm, appointmentId: value });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {appointments?.map((a: any) => (
                            <SelectItem key={a.id} value={a.id.toString()}>
                              #{a.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Tipo de Prescrição</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant={activeTab === "medical" ? "default" : "outline"}
                        onClick={() => setActiveTab("medical")}
                        className="flex-1"
                      >
                        Médica
                      </Button>
                      <Button
                        type="button"
                        variant={activeTab === "rehab" ? "default" : "outline"}
                        onClick={() => setActiveTab("rehab")}
                        className="flex-1"
                      >
                        Reabilitação
                      </Button>
                      <Button
                        type="button"
                        variant={activeTab === "evolution" ? "default" : "outline"}
                        onClick={() => setActiveTab("evolution")}
                        className="flex-1"
                      >
                        Evolução
                      </Button>
                    </div>
                  </div>

                  {/* Medical Prescription Form */}
                  {activeTab === "medical" && (
                    <form onSubmit={handleSubmitPrescription} className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-3">Adicionar Medicamento</h3>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <Label className="text-sm">Nome do Medicamento</Label>
                            <Input
                              value={currentMedication.name}
                              onChange={(e) => setCurrentMedication({ ...currentMedication, name: e.target.value })}
                              placeholder="Ex: Dipirona"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Dosagem</Label>
                            <Input
                              value={currentMedication.dosage}
                              onChange={(e) => setCurrentMedication({ ...currentMedication, dosage: e.target.value })}
                              placeholder="Ex: 500mg"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Frequência</Label>
                            <Input
                              value={currentMedication.frequency}
                              onChange={(e) => setCurrentMedication({ ...currentMedication, frequency: e.target.value })}
                              placeholder="Ex: 8h"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Duração</Label>
                            <Input
                              value={currentMedication.duration}
                              onChange={(e) => setCurrentMedication({ ...currentMedication, duration: e.target.value })}
                              placeholder="Ex: 7 dias"
                            />
                          </div>
                        </div>
                        <Button type="button" variant="outline" onClick={handleAddMedication} className="w-full">
                          Adicionar Medicamento
                        </Button>
                      </div>

                      {medicalForm.medications.length > 0 && (
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-slate-900 mb-3">Medicamentos Adicionados</h3>
                          <div className="space-y-2">
                            {medicalForm.medications.map((med, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border border-slate-200">
                                <div className="text-sm">
                                  <p className="font-medium">{med.name}</p>
                                  <p className="text-slate-600">{med.dosage} • {med.frequency} • {med.duration}</p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveMedication(idx)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <Label>Observações</Label>
                        <Textarea
                          value={medicalForm.notes}
                          onChange={(e) => setMedicalForm({ ...medicalForm, notes: e.target.value })}
                          placeholder="Notas adicionais"
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createPrescriptionMutation.isPending}>
                          {createPrescriptionMutation.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Rehabilitation Form */}
                  {activeTab === "rehab" && (
                    <form onSubmit={handleSubmitRehab} className="space-y-4">
                      <div>
                        <Label>Diagnóstico</Label>
                        <Textarea
                          value={rehabForm.diagnosis}
                          onChange={(e) => setRehabForm({ ...rehabForm, diagnosis: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Número de Sessões</Label>
                        <Input
                          type="number"
                          value={rehabForm.sessions}
                          onChange={(e) => setRehabForm({ ...rehabForm, sessions: e.target.value })}
                          required
                        />
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-slate-900 mb-3">Adicionar Exercício</h3>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="col-span-2">
                            <Label className="text-sm">Nome do Exercício</Label>
                            <Input
                              value={currentExercise.name}
                              onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                              placeholder="Ex: Alongamento"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-sm">Descrição</Label>
                            <Textarea
                              value={currentExercise.description}
                              onChange={(e) => setCurrentExercise({ ...currentExercise, description: e.target.value })}
                              placeholder="Descreva o exercício"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Repetições</Label>
                            <Input
                              type="number"
                              value={currentExercise.repetitions}
                              onChange={(e) => setCurrentExercise({ ...currentExercise, repetitions: parseInt(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Frequência</Label>
                            <Input
                              value={currentExercise.frequency}
                              onChange={(e) => setCurrentExercise({ ...currentExercise, frequency: e.target.value })}
                              placeholder="Ex: 2x dia"
                            />
                          </div>
                        </div>
                        <Button type="button" variant="outline" onClick={handleAddExercise} className="w-full">
                          Adicionar Exercício
                        </Button>
                      </div>

                      {rehabForm.exercises.length > 0 && (
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h3 className="font-semibold text-slate-900 mb-3">Exercícios Adicionados</h3>
                          <div className="space-y-2">
                            {rehabForm.exercises.map((ex, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border border-slate-200">
                                <div className="text-sm flex-1">
                                  <p className="font-medium">{ex.name}</p>
                                  <p className="text-slate-600">{ex.description}</p>
                                  <p className="text-slate-600">{ex.repetitions}x • {ex.frequency}</p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveExercise(idx)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <Label>Observações</Label>
                        <Textarea
                          value={rehabForm.notes}
                          onChange={(e) => setRehabForm({ ...rehabForm, notes: e.target.value })}
                          placeholder="Notas adicionais"
                        />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createRehabMutation.isPending}>
                          {createRehabMutation.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Evolution Form */}
                  {activeTab === "evolution" && (
                    <form onSubmit={handleSubmitEvolution} className="space-y-4">
                      <div>
                        <Label>Anotações Clínicas</Label>
                        <Textarea
                          value={evolutionForm.clinicalNotes}
                          onChange={(e) => setEvolutionForm({ ...evolutionForm, clinicalNotes: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label>Estado Emocional</Label>
                        <Input
                          value={evolutionForm.emotionalState}
                          onChange={(e) => setEvolutionForm({ ...evolutionForm, emotionalState: e.target.value })}
                          placeholder="Ex: Ansioso, Deprimido, Estável"
                        />
                      </div>
                      <div>
                        <Label>Plano de Tratamento</Label>
                        <Textarea
                          value={evolutionForm.treatmentPlan}
                          onChange={(e) => setEvolutionForm({ ...evolutionForm, treatmentPlan: e.target.value })}
                          placeholder="Próximas etapas do tratamento"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createEvolutionMutation.isPending}>
                          {createEvolutionMutation.isPending ? "Salvando..." : "Salvar"}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Prescriptions Tabs */}
        <div className="space-y-4">
          {/* Medical Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Prescrições Médicas</CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptions && prescriptions.length > 0 ? (
                <div className="space-y-3">
                  {prescriptions.map((p: any) => {
                    const meds = typeof p.medications === "string" ? JSON.parse(p.medications) : p.medications;
                    return (
                      <div key={p.id} className="p-4 bg-slate-50 rounded-lg">
                        <p className="font-medium text-slate-900">Prescrição #{p.id}</p>
                        <div className="mt-2 space-y-1">
                          {Array.isArray(meds) &&
                            meds.map((med: any, idx: number) => (
                              <p key={idx} className="text-sm text-slate-600">
                                • {med.name} - {med.dosage} • {med.frequency} • {med.duration}
                              </p>
                            ))}
                        </div>
                        {p.notes && <p className="text-sm text-slate-600 mt-2">{p.notes}</p>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-600 text-center py-8">Nenhuma prescrição médica</p>
              )}
            </CardContent>
          </Card>

          {/* Rehabilitation Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Planos de Reabilitação</CardTitle>
            </CardHeader>
            <CardContent>
              {rehabilitations && rehabilitations.length > 0 ? (
                <div className="space-y-3">
                  {rehabilitations.map((r: any) => {
                    const exs = typeof r.exercises === "string" ? JSON.parse(r.exercises) : r.exercises;
                    return (
                      <div key={r.id} className="p-4 bg-slate-50 rounded-lg">
                        <p className="font-medium text-slate-900">Plano #{r.id}</p>
                        <p className="text-sm text-slate-600 mt-1">Diagnóstico: {r.diagnosis}</p>
                        <p className="text-sm text-slate-600">Sessões: {r.sessions}</p>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-slate-900">Exercícios:</p>
                          <div className="space-y-1 mt-1">
                            {Array.isArray(exs) &&
                              exs.map((ex: any, idx: number) => (
                                <p key={idx} className="text-sm text-slate-600">
                                  • {ex.name} - {ex.repetitions}x • {ex.frequency}
                                </p>
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-600 text-center py-8">Nenhum plano de reabilitação</p>
              )}
            </CardContent>
          </Card>

          {/* Session Evolutions */}
          <Card>
            <CardHeader>
              <CardTitle>Evoluções de Sessão</CardTitle>
            </CardHeader>
            <CardContent>
              {evolutions && evolutions.length > 0 ? (
                <div className="space-y-3">
                  {evolutions.map((e: any) => (
                    <div key={e.id} className="p-4 bg-slate-50 rounded-lg">
                      <p className="font-medium text-slate-900">Evolução #{e.id}</p>
                      <p className="text-sm text-slate-600 mt-1">{e.clinicalNotes}</p>
                      {e.emotionalState && <p className="text-sm text-slate-600 mt-1">Estado: {e.emotionalState}</p>}
                      {e.treatmentPlan && <p className="text-sm text-slate-600 mt-1">Plano: {e.treatmentPlan}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 text-center py-8">Nenhuma evolução registrada</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
