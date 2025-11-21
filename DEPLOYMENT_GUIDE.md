# GitHub & Web Hoster Integration Guide

Diese Anleitung zeigt dir, wie du dein Projekt mit GitHub verbindest und automatisch auf deinen Web Hoster deployst.

## 1️⃣ GitHub Repository erstellen

### Schritt 1: GitHub Account & Repository
1. Gehe auf https://github.com/new
2. Repository Name: `marcolips-website`
3. Beschreibung: "Private Webseite mit interaktiven Tools"
4. Wähle **Private** (nur für dich sichtbar)
5. Klicke "Create repository"

### Schritt 2: Lokales Repository mit GitHub verbinden

```powershell
cd c:\Dev\marcolips-website

# Füge dein GitHub Repository als "origin" hinzu
git remote add origin https://github.com/DEIN_USERNAME/marcolips-website.git

# Benennen den Standard-Branch zu "main"
git branch -M main

# Erste Dateien hinzufügen
git add .

# Erstes Commit
git commit -m "Initial commit: Website mit Tools und Dokumentation"

# Zum GitHub pushen (du wirst nach Anmeldedaten gefragt)
git push -u origin main
```

---

## 2️⃣ Mit Web Hoster verbinden (FTP/SFTP)

### Option A: Mit FTP (Strato, 1&1, All-Inkl, etc.)

#### Schritt 1: Deploy-Script erstellen

Erstelle eine Datei `deploy.ps1`:

```powershell
# Verbindungsdaten
$ftpHost = "ftp.deinedomain.de"
$ftpUser = "dein_ftp_benutzername"
$ftpPass = "dein_ftp_passwort"
$remotePath = "/public_html/marcolips-website/"  # Anpassen!

# Lokale Dateien
$localPath = "C:\Dev\marcolips-website\"
$files = Get-ChildItem -Path $localPath -Recurse

# FTP Verbindung
$ftpRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost$remotePath")
$ftpRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
$ftpRequest.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory

Write-Host "Verbindung zum FTP-Server...`n"

foreach ($file in $files) {
    if (!$file.PSIsContainer) {
        $remoteName = $file.FullName.Replace($localPath, "").Replace("\", "/")
        
        # Upload
        $uploadRequest = [System.Net.FtpWebRequest]::Create("ftp://$ftpHost$remotePath$remoteName")
        $uploadRequest.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
        $uploadRequest.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        
        $fileContent = [System.IO.File]::ReadAllBytes($file.FullName)
        $uploadRequest.ContentLength = $fileContent.Length
        
        $stream = $uploadRequest.GetRequestStream()
        $stream.Write($fileContent, 0, $fileContent.Length)
        $stream.Close()
        
        Write-Host "✓ Hochgeladen: $remoteName"
    }
}

Write-Host "`nDeploy abgeschlossen!"
```

#### Schritt 2: Deploy-Anmeldedaten sicher speichern

Erstelle `deploy-config.json` (nur lokal, nicht in Git!):

```json
{
  "ftp": {
    "host": "ftp.deinedomain.de",
    "user": "dein_ftp_benutzername",
    "password": "dein_ftp_passwort",
    "remotePath": "/public_html/marcolips-website/",
    "port": 21
  }
}
```

**Wichtig:** Diese Datei ist bereits in `.gitignore` eingetragen! Sie wird niemals zu GitHub hochgeladen.

---

### Option B: Mit SFTP (sicherer - empfohlen)

Installiere PuTTY/WinSCP für grafische SFTP-Verbindung:

1. Lade [WinSCP](https://winscp.net/) herunter
2. Verbinde dich mit deinem Server via SFTP
3. Dragg & Drop deine Dateien

---

## 3️⃣ Workflow für lokale Entwicklung

### Auf deinem Notebook arbeiten:

```powershell
cd c:\Dev\marcolips-website

# 1. Änderungen überprüfen
git status

# 2. Alle Änderungen hinzufügen
git add .

# 3. Commit mit Nachricht
git commit -m "Beschreibe deine Änderungen hier"

# 4. Zu GitHub pushen
git push origin main

# 5. Zur Webseite deployen
# (Je nach Methode: deploy.ps1 ausführen oder WinSCP nutzen)
```

---

## 4️⃣ Automatisches Deployment mit GitHub Actions

### Schritt 1: Secrets auf GitHub hinzufügen

1. Gehe zu deinem Repository auf GitHub
2. Settings → Secrets and variables → Actions
3. Neue Secrets hinzufügen:
   - `FTP_HOST`: dein_ftp_host
   - `FTP_USER`: dein_ftp_user
   - `FTP_PASS`: dein_ftp_passwort
   - `FTP_REMOTE_PATH`: /public_html/marcolips-website/

### Schritt 2: GitHub Actions Workflow erstellen

Erstelle `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Web Hoster

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: FTP Deploy
        uses: appleboy/ftp-action@master
        with:
          host: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASS }}
          local_dir: ./
          remote_dir: ${{ secrets.FTP_REMOTE_PATH }}
          delete: true
```

**Vorteil:** Jedes Mal wenn du zu `main` pushst, wird automatisch deployt! ✨

---

## 5️⃣ Struktur für mehrere Geräte

### Auf neuem Notebook (z.B. Laptop unterwegs):

```powershell
# Repository klonen
git clone https://github.com/DEIN_USERNAME/marcolips-website.git
cd marcolips-website

# Änderungen machen...
# ...

# Und pushen (auf anderem PC)
git add .
git commit -m "Änderungen vom Laptop"
git push origin main

# Zurück auf Heim-PC:
git pull origin main  # Holt alle neuesten Änderungen
```

---

## 📋 Checkliste zum Einrichten

- [ ] GitHub Account erstellen (https://github.com)
- [ ] GitHub Repository erstellen
- [ ] Lokales Repository mit GitHub verbinden (`git remote add origin`)
- [ ] Erstes Push zu GitHub machen (`git push -u origin main`)
- [ ] FTP/SFTP-Zugänge vom Web Hoster beschaffen
- [ ] `deploy-config.json` mit deinen Daten erstellen (nicht zu Git hinzufügen!)
- [ ] Deploy-Skript oder WinSCP einrichten
- [ ] Erste Deployment durchführen
- [ ] GitHub Secrets einrichten (für automatisiertes Deployment)
- [ ] `.github/workflows/deploy.yml` erstellen (optional)

---

## 🔐 Sicherheitstipps

1. **Passwörter niemals in Dateien schreiben**, die zu Git gehen
2. `.gitignore` enthält bereits: `deploy-config.json`
3. Nutze GitHub Secrets für sensitive Daten
4. Verwende SFTP statt FTP (verschlüsselt)
5. Regelmäßig Backups machen!

---

## 🚀 Beispiel Workflow

```
Dein PC (lokal)
    ↓ git push
GitHub Repository
    ↓ (auto mit Actions)
Web Hoster (Live)
    ↓
Deine Website unter https://deinedomain.de/marcolips-website/
```

---

## 💡 Tipps & Tricks

### Commit-Historie anschauen:
```powershell
git log --oneline
```

### Letzte Änderungen zurückfahren:
```powershell
git revert HEAD  # Letzten Commit rückgängig machen
```

### Branch zum Testen erstellen:
```powershell
git checkout -b feature/neue-funktion
# ... Änderungen ...
git push origin feature/neue-funktion
# Auf GitHub: Pull Request erstellen zum Review
```

---

## Fragen?

Wenn etwas nicht funktioniert:
1. Überprüfe deine FTP/GitHub-Anmeldedaten
2. Schau die Error-Meldungen genau an
3. Nutze `git status` zum Überprüfen des aktuellen Status

Viel Erfolg beim Deployment! 🚀
