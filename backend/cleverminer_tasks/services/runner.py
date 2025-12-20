from cleverminer_tasks.models import Run, ProcedureType
from .cfMiner.mining import CfMiningService
from .fourftMiner.mining import FourFtMiningService
from .sdFourftMiner.mining import Sd4FtMiningService
from .uicMiner.mining import UICMiningService


def run_analysis(run: Run) -> Run:
    procedure = run.task.procedure
    if procedure == ProcedureType.FOUR_FT:
        service = FourFtMiningService(run)
    elif procedure == ProcedureType.SD4FT:
        service = Sd4FtMiningService(run)
    elif procedure == ProcedureType.CF_MINER:
        service = CfMiningService(run)
    elif procedure == ProcedureType.UIC_MINER:
        service = UICMiningService(run)
    else:
        raise ValueError(f"Unsupported procedure: {procedure}")

    return service.run()
