import { ProceduresType } from '@/shared/domain/procedures.type';

export const PROCEDURE_STYLES: Record<ProceduresType, { bg: string; text: string }> = {
  [ProceduresType.FOURFTMINER]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
  },
  [ProceduresType.SD4FTMINER]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  [ProceduresType.CFMINER]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
  },
  [ProceduresType.UICMINER]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
  },
};
