# Image officielle Python
FROM python:3.11-slim

# Dossier de travail dans le container
WORKDIR /app

# Copier les fichiers requirements
COPY requirements.txt .

# Installer les dépendances
RUN pip install --default-timeout=100 --no-cache-dir -r requirements.txt


# Copier tout le code
COPY . .

# Exposer le port Flask
EXPOSE 5000

# Lancer l'application
CMD ["python", "app.py"]
