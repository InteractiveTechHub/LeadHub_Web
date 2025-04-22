
export enum LeadPhase {
  New = 1,
  InProgress = 2,
  Appointment = 3,
  Closed = 4,
}

export const LeadPhaseMetadata: Record<LeadPhase, { label: string; severity: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined }> = {
  [LeadPhase.New]: { label: 'Novo', severity: 'secondary' },
  [LeadPhase.InProgress]: { label: 'Em andamento', severity: 'success' },
  [LeadPhase.Appointment]: { label: 'Agendado', severity: 'info' },
  [LeadPhase.Closed]: { label: 'Fechado', severity: 'warn' },
};
