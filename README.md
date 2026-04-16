# 🌿 KrishiScan - AI-Powered Crop Disease Detection

Full-stack production application with FastAPI backend + React frontend.

## 🌐 Live Application

**🚀 Live Demo:** [https://krishi-scan-ai.vercel.app/](https://krishi-scan-ai.vercel.app/)

**📚 API Documentation:** [https://krishiscanai-production.up.railway.app/docs](https://krishiscanai-production.up.railway.app/docs)

---

## 📁 Project Structure

```
krishiscan/
├── backend/                     # FastAPI Backend
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── core/
│   │   │   ├── config.py        # Settings (.env se)
│   │   │   ├── database.py      # PostgreSQL connection
│   │   │   ├── security.py      # JWT auth
│   │   │   └── model_loader.py  # ML model loader
│   │   ├── models/
│   │   │   └── db_models.py     # User, ScanReport tables
│   │   ├── schemas/
│   │   │   └── schemas.py       # Request/Response validation
│   │   ├── services/
│   │   │   └── disease_service.py
│   │   └── routes/
│   │       ├── auth.py          # /api/auth/register, /login
│   │       ├── predict.py       # /api/predict
│   │       ├── reports.py       # /api/reports
│   │       ├── users.py         # /api/users/me
│   │       └── disease_info.py  # /api/disease-info
│   ├── models_ml/               # ML model files (.h5)
│   ├── disease_data/            # Disease info JSON files
│   ├── requirements.txt
│   ├── create_tables.py
│   └── .env
│
├── frontend/                    # React + Vite Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Scanner.jsx      # Image upload & scan
│   │   │   ├── Result.jsx       # Disease detection result
│   │   │   ├── Dashboard.jsx    # User dashboard
│   │   │   ├── Login.jsx        # Auth page
│   │   │   └── Pricing.jsx      # Pricing plans
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── api/
│   │   │   └── axios.js         # API client
│   │   ├── locales/             # i18n (Hindi + English)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
└── README.md                    # Yeh file
```

---

---

## 🚀 Local Development Setup

### Backend Setup

#### Step 1 — Virtual Environment banao

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

#### Step 2 — Dependencies install karo

```bash
pip install -r requirements.txt
```

#### Step 3 — PostgreSQL setup karo

```bash
# PostgreSQL install karo (agar nahi hai)
# Windows: https://www.postgresql.org/download/
# Mac: brew install postgresql

# Database banao
psql -U postgres
CREATE DATABASE krishiscan;
\q
```

#### Step 4 — .env file banao

```bash
cp .env.example .env
```

`.env` mein yeh values set karo:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/krishiscan
SECRET_KEY=your-secret-key-here
SUGARCANE_MODEL_PATH=models_ml/sugarcane_phase2_best.h5
OTHER_CROPS_MODEL_PATH=models_ml/other_crops_model_best.h5
```

#### Step 5 — Database tables banao

```bash
python create_tables.py
```

#### Step 6 — Backend server start karo

```bash
uvicorn app.main:app --reload --port 8000
```

API Docs: **http://localhost:8000/docs** 🎉

---

### Frontend Setup

#### Step 1 — Dependencies install karo

```bash
cd frontend
npm install
```

#### Step 2 — .env file banao

```bash
echo VITE_API_URL=http://localhost:8000 > .env
```

#### Step 3 — Development server start karo

```bash
npm run dev
```

Frontend: **http://localhost:5173** 🚀

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

## 🚢 Production Deployment

### Backend Deployment (Railway)

#### Step 1 — Railway account banao
- https://railway.app pe jao
- GitHub se login karo

#### Step 2 — New Project banao
- "New Project" → "Deploy from GitHub repo"
- `krishiscan` repo select karo
- Root directory: `/backend`

#### Step 3 — PostgreSQL add karo
- "New" → "Database" → "Add PostgreSQL"
- Automatically `DATABASE_URL` environment variable set ho jayega

#### Step 4 — Environment Variables set karo
```env
SECRET_KEY=your-production-secret-key
SUGARCANE_MODEL_PATH=models_ml/sugarcane_phase2_best.h5
OTHER_CROPS_MODEL_PATH=models_ml/other_crops_model_best.h5
ALLOWED_ORIGINS=https://krishi-scan-ai.vercel.app
```

#### Step 5 — Deploy!
Railway automatically detect karega aur deploy kar dega.

**Backend URL:** `https://krishiscanai-production.up.railway.app`

---

### Frontend Deployment (Vercel)

#### Step 1 — Vercel account banao
- https://vercel.com pe jao
- GitHub se login karo

#### Step 2 — New Project
- "Add New" → "Project"
- `krishiscan` repo select karo
- Root Directory: `frontend`
- Framework Preset: `Vite`

#### Step 3 — Environment Variables
```env
VITE_API_URL=https://krishiscanai-production.up.railway.app
```

#### Step 4 — Deploy!
Vercel automatically build aur deploy kar dega.

**Frontend URL:** `https://krishi-scan-ai.vercel.app`

---

### Post-Deployment Checklist

✅ Backend health check: `https://krishiscanai-production.up.railway.app/health`  
✅ API docs: `https://krishiscanai-production.up.railway.app/docs`  
✅ Frontend load ho raha hai: `https://krishi-scan-ai.vercel.app`  
✅ Login/Register kaam kar raha hai  
✅ Image upload aur scan kaam kar raha hai  
✅ CORS properly configured hai

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

---

## 🎯 Features

### ✅ Completed
- 🤖 AI-powered disease detection (95%+ accuracy)
- 📸 Image upload with preview
- 🌾 Multi-crop support (Sugarcane, Tomato, Potato, etc.)
- 🇮🇳 Bilingual support (Hindi + English)
- 🔐 JWT authentication
- 📊 User dashboard with scan history
- 💎 Pricing page with monthly/yearly plans
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- 🚀 Production deployment ready

### 🔜 Upcoming
- 💳 Razorpay payment integration
- 📄 PDF report generation
- 📧 Email notifications
- 🔔 Push notifications
- 📈 Advanced analytics

---

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python)
- PostgreSQL
- TensorFlow/Keras
- JWT Authentication
- SQLAlchemy ORM

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- i18next (Internationalization)
- Lucide React (Icons)

**Deployment:**
- Backend: Railway
- Frontend: Vercel
- Database: Railway PostgreSQL

---

## 📞 Support

Koi issue hai? Contact karo:
- Email: tyagideepak1007@gmail.com
- LinkedIn: [Deepak Tyagi](https://www.linkedin.com/in/tyagi-deepak/)
- GitHub: [Tyagideepak108](https://github.com/Tyagideepak108)

---

## 📄 License

MIT License - Free to use for learning and commercial purposes.

---

**Made with ❤️ for Indian Farmers** 🇮🇳