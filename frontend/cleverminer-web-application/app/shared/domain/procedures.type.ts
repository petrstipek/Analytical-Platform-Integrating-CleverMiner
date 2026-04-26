export enum ProceduresType {
  CFMINER = 'CFMiner',
  SD4FTMINER = 'SD4ftMiner',
  UICMINER = 'UICMiner',
  FOURFTMINER = 'fourftMiner',
}

export const PROCEDURE_LABELS: Record<ProceduresType, string> = {
  [ProceduresType.CFMINER]: 'CF-Miner',
  [ProceduresType.SD4FTMINER]: 'SD4ft-Miner',
  [ProceduresType.UICMINER]: 'UIC-Miner',
  [ProceduresType.FOURFTMINER]: '4ft-Miner',
};
