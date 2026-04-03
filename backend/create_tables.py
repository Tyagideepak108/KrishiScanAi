"""
Database Tables banane ke liye yeh script run karo:
    python create_tables.py

Pehli baar run karo - yeh sab tables create kar dega.
"""
from app.core.database import engine, Base
from app.models.db_models import User, ScanReport  # import zaruri hai

if __name__ == "__main__":
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Done! Tables created:")
    print("  - users")
    print("  - scan_reports")