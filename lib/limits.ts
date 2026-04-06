export const PLAN_LIMITS = {
  FREE: {
    templates: 1,
    itemsPerTemplate: 10,
    checklists: Infinity,
    categories: 0,
    qrCode: false,
    pdfReport: false,
    history: false,
  },
  TRIAL: {
    templates: Infinity,
    itemsPerTemplate: Infinity,
    checklists: Infinity,
    categories: Infinity,
    qrCode: true,
    pdfReport: true,
    history: true,
  },
  PRO: {
    templates: Infinity,
    itemsPerTemplate: Infinity,
    checklists: Infinity,
    categories: Infinity,
    qrCode: true,
    pdfReport: true,
    history: true,
  },
} as const;

export type PlanName = keyof typeof PLAN_LIMITS;
