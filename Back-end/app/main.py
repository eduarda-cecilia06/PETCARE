from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .database import engine, get_db
from . import models, schemas, auth

#Cria as tabelas no banco (caso não existam)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="PetCare API")
security = HTTPBearer()

# Dependência para pegar usuário logado 
def get_usuario_atual(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = auth.verificar_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido")
    email = payload.get("sub")
    usuario = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if usuario is None:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return usuario

# Cadastrar Tutor
@app.post("/api/usuarios", response_model=schemas.UsuarioResponse, status_code=201)
def cadastrar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    # Verifica se e-mail já existe
    if db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first():
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    
    senha_hash = auth.gerar_hash_senha(usuario.senha)
    novo_usuario = models.Usuario(
        nome=usuario.nome,
        email=usuario.email,
        senha_hash=senha_hash
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario

# Fazer Login
@app.post("/api/usuarios/login", response_model=schemas.TokenResponse)
def login(dados: schemas.LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == dados.email).first()
    if not usuario or not auth.verificar_senha(dados.senha, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")
    
    token = auth.criar_token_acesso(data={"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}

# Cadastrar Pet
@app.post("/api/pets", response_model=schemas.PetResponse, status_code=201)
def cadastrar_pet(pet: schemas.PetCreate, db: Session = Depends(get_db), usuario_atual: models.Usuario = Depends(get_usuario_atual)):
    novo_pet = models.Pet(
        usuario_id=usuario_atual.id,
        **pet.dict()
    )
    db.add(novo_pet)
    db.commit()
    db.refresh(novo_pet)
    return novo_pet

# Listar Pets do Tutor Logado
@app.get("/api/pets", response_model=list[schemas.PetResponse])
def listar_pets(db: Session = Depends(get_db), usuario_atual: models.Usuario = Depends(get_usuario_atual)):
    pets = db.query(models.Pet).filter(models.Pet.usuario_id == usuario_atual.id).all()
    return pets

# Adicionar Evento a um Pet
@app.post("/api/pets/{pet_id}/eventos", response_model=schemas.EventoResponse, status_code=201)
def adicionar_evento(pet_id: int, evento: schemas.EventoCreate, db: Session = Depends(get_db), usuario_atual: models.Usuario = Depends(get_usuario_atual)):
    # Verifica se o pet pertence ao usuário logado
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id, models.Pet.usuario_id == usuario_atual.id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet não encontrado")
    
    novo_evento = models.Evento(
        pet_id=pet_id,
        **evento.dict()
    )
    db.add(novo_evento)
    db.commit()
    db.refresh(novo_evento)
    return novo_evento

# Visualizar Histórico de um Pet
@app.get("/api/pets/{pet_id}/eventos", response_model=list[schemas.EventoResponse])
def listar_eventos(pet_id: int, db: Session = Depends(get_db), usuario_atual: models.Usuario = Depends(get_usuario_atual)):
    pet = db.query(models.Pet).filter(models.Pet.id == pet_id, models.Pet.usuario_id == usuario_atual.id).first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet não encontrado")
    
    eventos = db.query(models.Evento).filter(models.Evento.pet_id == pet_id).order_by(models.Evento.data.desc()).all()
    return eventos

# Buscar dados do usuário logado
@app.get("/api/usuarios/me", response_model=schemas.UsuarioResponse)
def obter_usuario_atual(usuario_atual: models.Usuario = Depends(get_usuario_atual)):
    return usuario_atual