from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./textguard.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class PredictionModel(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, index=True)
    type = Column(String, index=True) # 'spam' or 'toxicity'
    result = Column(String) # 'Spam' / 'Not Spam' or 'Toxic' / 'Non-Toxic'
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
