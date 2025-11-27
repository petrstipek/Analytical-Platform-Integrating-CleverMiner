from cleverminer_tasks.models import Analysis, ProcedureType
from .fourftMiner.mining import FourFtMiningService


def run_analysis(analysis: Analysis) -> Analysis:
    if analysis.procedure == ProcedureType.FOUR_FT:
        service = FourFtMiningService(analysis)
    # elif analysis.procedure == ProcedureType.SD4FT:
    else:
        raise ValueError(f"Unsupported procedure: {analysis.procedure}")

    return service.run()
