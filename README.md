# 🌿 KrishiScan Backend - FastAPI

Tera Streamlit app ab ek professional FastAPI backend ban gaya hai.

---

## 📁 Project Structure

```
krishiscan-backend/
├── app/
│   ├── main.py                  # FastAPI app entry point
│   ├── core/
│   │   ├── config.py            # Settings (.env se)
│   │   ├── database.py          # PostgreSQL connection
│   │   ├── security.py          # JWT auth
│   │   └── model_loader.py      # Tera predict.py - FastAPI version
│   ├── models/
│   │   └── db_models.py         # User, ScanReport tables
│   ├── schemas/
│   │   └── schemas.py           # Request/Response validation
│   ├── services/
│   │   └── disease_service.py   # JSON disease info loader
│   └── routes/
│       ├── auth.py              # /api/auth/register, /login
│       ├── predict.py           # /api/predict  ← MAIN ROUTE
│       ├── reports.py           # /api/reports
│       ├── users.py             # /api/users/me
│       └── disease_info.py      # /api/disease-info
├── models_ml/                   # Apni .h5 files yahan rakho
│   ├── sugarcane_phase2_best.h5
│   └── other_crops_model_best.h5
├── disease_data/                # Apni JSON files yahan rakho
│   ├── sugercane_info.json
│   └── other_diseases_info.json
├── requirements.txt
├── create_tables.py
└── .env.example                 # Isko copy karke .env banao
```

---

## 🚀 Step-by-Step Setup

### Step 1 — Virtual Environment banao

```bash
cd krishiscan-backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### Step 2 — Dependencies install karo

```bash
pip install -r requirements.txt
```

### Step 3 — PostgreSQL setup karo

```bash
# PostgreSQL install karo (agar nahi hai)
# Windows: https://www.postgresql.org/download/
# Mac: brew install postgresql

# Database banao
psql -U postgres
CREATE DATABASE krishiscan;
\q
```

### Step 4 — .env file banao

```bash
cp .env.example .env
# Ab .env file kholo aur apni values bharo
```

`.env` mein yeh zarur change karo:
```
DATABASE_URL=postgresql://postgres:TERA_PASSWORD@localhost:5432/krishiscan
SECRET_KEY=koi-bhi-random-64-char-string
```

### Step 5 — Apni files copy karo

```bash
# .h5 model files
cp /path/to/sugarcane_phase2_best.h5    models_ml/
cp /path/to/other_crops_model_best.h5   models_ml/

# JSON disease info files
cp /path/to/sugercane_info.json         disease_data/
cp /path/to/other_diseases_info.json    disease_data/
```

### Step 6 — Database tables banao

```bash
python create_tables.py
```

Output aayega:
```
Creating database tables...
Done! Tables created:
  - users
  - scan_reports
```

### Step 7 — Server start karo

```bash
uvicorn app.main:app --reload --port 8000
```

Browser mein kholo: **http://localhost:8000/docs**

Yahan tera poora API interactive documentation mil jaayegi! 🎉

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Naya user register |
| POST | `/api/auth/login` | Login, JWT token milega |

### Prediction (MAIN)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict/?crop_type=sugarcane&lang=hi` | Auth user ka scan |
| POST | `/api/predict/guest?crop_type=other_crops&lang=en` | Bina login ke scan |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/` | Meri scan history |
| POST | `/api/reports/feedback` | Yes/No feedback |
| DELETE | `/api/reports/{id}` | Report delete |

### Disease Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/disease-info/?crop_type=sugarcane` | Disease list |
| GET | `/api/disease-info/{disease_key}?crop_type=sugarcane&lang=hi` | Disease detail |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Meri profile |
| PATCH | `/api/users/me` | Profile update |

---

## 🧪 API Test kaise karo (Postman / curl)

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Deepak","email":"deepak@test.com","password":"test123"}'
```

### Predict (image bhejo)
```bash
curl -X POST "http://localhost:8000/api/predict/guest?crop_type=sugarcane&lang=hi" \
  -F "file=@/path/to/leaf.jpg"
```

---

## 🚢 Deployment (Railway)

```bash
# 1. railway.app pe account banao (GitHub se login)
# 2. New Project → Deploy from GitHub repo
# 3. Add PostgreSQL plugin (free tier)
# 4. Environment variables set karo (same as .env)
# 5. Start command:
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Note:** Railway pe models_ml folder bhi push karo GitHub pe —
.gitignore mein .h5 files add mat karna!

---

## ⚠️ Common Errors aur Solutions

**`ModuleNotFoundError: No module named 'app'`**
```bash
# Backend root folder se run karo
cd krishiscan-backend
uvicorn app.main:app --reload
```

**`Could not load sugarcane model`**
```bash
# Check karo .env mein paths sahi hain
# aur models_ml/ folder mein .h5 files hain
ls models_ml/
```

**`psycopg2.OperationalError`**
```bash
# PostgreSQL chal raha hai? Check karo:
# Windows: Services mein postgresql dekho
# Mac/Linux: sudo service postgresql start
```

---

## 🔜 Agle Steps (Frontend)

Backend ready hai! Ab React frontend banana hai:
1. `cd ..` aur `krishiscan-frontend` folder banao
2. `npm create vite@latest krishiscan-frontend -- --template react`
3. Axios se in APIs ko call karo

Teri poori journey:
```
✅ Backend (FastAPI) — DONE
⬜ Frontend (React + Vite)
⬜ Razorpay payment integration
⬜ Deploy (Vercel + Railway)
```