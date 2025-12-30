from pydantic import BaseModel

class BeasiswaTrend(BaseModel):
    thajaranid: int
    total_beasiswa: int
    lolos: int
    tidak_lolos: int
