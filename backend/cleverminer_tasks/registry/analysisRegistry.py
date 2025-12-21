from typing import Type

from cleverminer_tasks.execution.procedures.cfMiner.mining import CfMiningService
from cleverminer_tasks.execution.procedures.fourftMiner.mining import (
    FourFtMiningService,
)
from cleverminer_tasks.execution.procedures.sdFourftMiner.mining import (
    Sd4FtMiningService,
)
from cleverminer_tasks.execution.procedures.uicMiner.mining import UICMiningService
from cleverminer_tasks.execution.shared.baseMining import BaseMiningService
from cleverminer_tasks.models import ProcedureType

MINING_SERVICE_ANALYSIS_REGISTRY: dict[str, Type[BaseMiningService]] = {
    ProcedureType.FOUR_FT: FourFtMiningService,
    ProcedureType.SD4FT: Sd4FtMiningService,
    ProcedureType.CF_MINER: CfMiningService,
    ProcedureType.UIC_MINER: UICMiningService,
}
