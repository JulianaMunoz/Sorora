from pydantic import BaseModel
from typing import Optional

class Albergue(BaseModel):
    id: Optional[str]
    name: str
    address: str
    latitude: float
    longitude: float
    capacity: int
    phone: str
