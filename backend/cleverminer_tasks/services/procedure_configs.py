from typing import Mapping, Type

from pydantic import BaseModel

from cleverminer_tasks.models import ProcedureType
from cleverminer_tasks.services.cfMiner.config import CfMinerConfig
from cleverminer_tasks.services.fourftMiner.configs import FourFtConfig
from cleverminer_tasks.services.sdFourftMiner.configs import Sd4FtConfig
from cleverminer_tasks.services.uicMiner.config import UicMinerConfig

PROCEDURE_CONFIG_REGISTRY: Mapping[str, Type[BaseModel]] = {
    ProcedureType.FOUR_FT.value: FourFtConfig,
    ProcedureType.SD4FT.value: Sd4FtConfig,
    ProcedureType.CF_MINER.value: CfMinerConfig,
    ProcedureType.UIC_MINER.value: UicMinerConfig,
}
