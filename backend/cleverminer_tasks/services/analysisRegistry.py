from typing import Type

from cleverminer_tasks.models import ProcedureType
from cleverminer_tasks.services.cfMiner.mining import CfMiningService
from cleverminer_tasks.services.fourftMiner.mining import FourFtMiningService
from cleverminer_tasks.services.sdFourftMiner.mining import Sd4FtMiningService
from cleverminer_tasks.services.shared.baseMining import BaseMiningService
from cleverminer_tasks.services.uicMiner.mining import UICMiningService

MINING_SERVICE_ANALYSIS_REGISTRY: dict[str, Type[BaseMiningService]] = {
    ProcedureType.FOUR_FT.value: FourFtMiningService,
    ProcedureType.SD4FT.value: Sd4FtMiningService,
    ProcedureType.CF_MINER.value: CfMiningService,
    ProcedureType.UIC_MINER.value: UICMiningService
}
