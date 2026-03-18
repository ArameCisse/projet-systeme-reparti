# Projet Système Réparti (SR)

Stack (phase 1) : **React** (frontend) + **Django REST** (backend) + **PostgreSQL** (config prête).

## Structure du repository

```
.
├─ backend/                 # Django REST API
│  ├─ config/               # settings/urls/asgi/wsgi
│  ├─ accounts/             # modèle User (custom) + API read-only
│  ├─ catalog/              # modèle Product + API CRUD
│  ├─ manage.py
│  └─ requirements.txt
├─ frontend/                # React (Vite)
├─ docs/
├─ .env.example             # variables d'environnement (PostgreSQL, CORS, Django)
└─ .gitignore
```

## Démarrage local (sans Docker)

### Backend

Créer un virtualenv (si besoin) et installer les dépendances :

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
```

Lancer en **SQLite** (pratique si PostgreSQL n’est pas encore installé) :

```bash
. .venv/bin/activate
cd backend
DB_ENGINE=sqlite python manage.py migrate
DB_ENGINE=sqlite python manage.py runserver 8000
```

API :
- `GET /health/`
- `GET /api/products/`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend utilise un **proxy Vite** vers `http://localhost:8000` pour `/api` et `/health`.

## PostgreSQL (configuration)

La config PostgreSQL est gérée par variables d’environnement (voir `.env.example`) :
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

On branchera PostgreSQL via **Docker Compose** dans la prochaine étape.
