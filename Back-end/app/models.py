from sqlalchemy import Column, Integer, String, Date, DateTime, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    data_cadastro = Column(DateTime, server_default=func.now())

    pets = relationship("Pet", back_populates="tutor", cascade="all, delete-orphan")

class Pet(Base):
    __tablename__ = "pets"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nome = Column(String(50), nullable=False)
    especie = Column(String(30), nullable=False)
    raca = Column(String(50))
    data_nascimento = Column(Date)
    genero = Column(String(20))
    peso = Column(Numeric(5, 2))
    foto = Column(Text)
    data_cadastro = Column(DateTime, server_default=func.now())

    tutor = relationship("Usuario", back_populates="pets")
    eventos = relationship("Evento", back_populates="pet", cascade="all, delete-orphan")

class Evento(Base):
    __tablename__ = "eventos"

    id = Column(Integer, primary_key=True, index=True)
    pet_id = Column(Integer, ForeignKey("pets.id"), nullable=False)
    tipo = Column(String(30), nullable=False)
    nome = Column(String(100), nullable=False)
    data = Column(DateTime, nullable=False)
    descricao = Column(Text)
    custo = Column(Numeric(10, 2))
    data_criacao = Column(DateTime, server_default=func.now())

    pet = relationship("Pet", back_populates="eventos")