import { ProceduresType } from '@/shared/domain/procedures.type';

export const PROCEDURE_STYLES: Record<
  ProceduresType,
  { bg: string; text: string; bg_light: string; bg_histogram: string }
> = {
  [ProceduresType.FOURFTMINER]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    bg_light: 'bg-blue-100/80',
    bg_histogram: 'bg-blue-300',
  },
  [ProceduresType.SD4FTMINER]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    bg_light: 'bg-green-100/50',
    bg_histogram: 'bg-purple-300',
  },
  [ProceduresType.CFMINER]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    bg_light: 'bg-purple-100/50',
    bg_histogram: 'bg-purple-300',
  },
  [ProceduresType.UICMINER]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    bg_light: 'bg-orange-100/50',
    bg_histogram: 'bg-orange-300',
  },
};
