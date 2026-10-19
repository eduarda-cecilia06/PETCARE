from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional, List

# Usuário
class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str

class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: str
    data_cadastro: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    senha: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Pet
class PetCreate(BaseModel):
    nome: str
    especie: str
    raca: Optional[str] = None
    data_nascimento: Optional[date] = None
    genero: Optional[str] = None
    peso: Optional[float] = None
    foto: Optional[str] = None

class PetResponse(BaseModel):
    id: int
    nome: str
    especie: str
    raca: Optional[str]
    data_nascimento: Optional[date]
    genero: Optional[str]
    peso: Optional[float]
    foto: Optional[str]

    class Config:
        from_attributes = True

# Evento
class EventoCreate(BaseModel):
    tipo: str
    nome: str
    data: datetime
    descricao: Optional[str] = None
    custo: Optional[float] = None

class EventoResponse(BaseModel):
    id: int
    pet_id: int
    tipo: str
    nome: str
    data: datetime
    descricao: Optional[str]
    custo: Optional[float]

    class Config:
        from_attributes = True