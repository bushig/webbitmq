from pydantic import BaseModel


class ServerSettings(BaseModel):
    """Settings of application for frontend"""
    can_edit_servers: bool
