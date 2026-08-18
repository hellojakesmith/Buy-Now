export const defaultPipelineStages = [
  { key: "new", label: "New", color: "#0325D9", position: 0, isWon: false, isLost: false },
  { key: "contacted", label: "Contacted", color: "#FF8A00", position: 1, isWon: false, isLost: false },
  { key: "qualified", label: "Qualified", color: "#7448F6", position: 2, isWon: false, isLost: false },
  { key: "proposal", label: "Proposal", color: "#16B879", position: 3, isWon: false, isLost: false },
  { key: "won", label: "Won", color: "#16B879", position: 4, isWon: true, isLost: false },
  { key: "lost", label: "Lost", color: "#6B7280", position: 5, isWon: false, isLost: true },
] as const;
