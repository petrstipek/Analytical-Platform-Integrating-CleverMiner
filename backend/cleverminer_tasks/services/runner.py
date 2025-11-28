from cleverminer_tasks.models import Analysis, ProcedureType
from .fourftMiner.mining import FourFtMiningService
from .sdFourftMiner.mining import Sd4FtMiningService


def run_analysis(analysis: Analysis) -> Analysis:
    if analysis.procedure == ProcedureType.FOUR_FT:
        service = FourFtMiningService(analysis)
    elif analysis.procedure == ProcedureType.SD4FT:
        service = Sd4FtMiningService(analysis)
    else:
        raise ValueError(f"Unsupported procedure: {analysis.procedure}")

    return service.run()
