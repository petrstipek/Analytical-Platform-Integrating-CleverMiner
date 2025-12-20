from typing import Mapping, Type

from pydantic import BaseModel

from cleverminer_tasks.execution.procedures.cfMiner.config import CfMinerConfig
from cleverminer_tasks.execution.procedures.fourftMiner.configs import FourFtConfig
from cleverminer_tasks.execution.procedures.sdFourftMiner.configs import Sd4FtConfig
from cleverminer_tasks.execution.procedures.uicMiner.config import UicMinerConfig
from cleverminer_tasks.models import ProcedureType

PROCEDURE_CONFIG_REGISTRY: Mapping[str, Type[BaseModel]] = {
    ProcedureType.FOUR_FT.value: FourFtConfig,
    ProcedureType.SD4FT.value: Sd4FtConfig,
    ProcedureType.CF_MINER.value: CfMinerConfig,
    ProcedureType.UIC_MINER.value: UicMinerConfig,
}
