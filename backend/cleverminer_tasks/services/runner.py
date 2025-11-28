from cleverminer_tasks.models import Analysis, ProcedureType
from .cfMiner.mining import CfMiningService
from .fourftMiner.mining import FourFtMiningService
from .sdFourftMiner.mining import Sd4FtMiningService


def run_analysis(analysis: Analysis) -> Analysis:
    if analysis.procedure == ProcedureType.FOUR_FT:
        service = FourFtMiningService(analysis)
    elif analysis.procedure == ProcedureType.SD4FT:
        service = Sd4FtMiningService(analysis)
    elif analysis.procedure == ProcedureType.CF_MINER:
        service = CfMiningService(analysis)
    else:
        raise ValueError(f"Unsupported procedure: {analysis.procedure}")

    return service.run()
