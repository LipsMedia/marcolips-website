# 🚀 Quick Start - GitHub & Hosting Setup

## 5 Minuten Setup für GitHub + Web Hoster

### 1. GitHub Repository erstellen (2 Min)

```powershell
# Terminal öffnen und folgende Befehle nacheinander eingeben:

cd c:\Dev\marcolips-website

git config --global user.name "Dein Name"
git config --global user.email "deine@email.com"

git add .
git commit -m "Initial commit: Webseite mit interaktiven Tools"
```

📝 **Dann auf https://github.com/new gehen und:**
- Repository Name: `marcolips-website`
- Wähle "Private" (nur für dich sichtbar)
- Klick "Create repository"

Danach kopiere die URL (z.B. `https://github.com/deinusername/marcolips-website.git`)

```powershell
# Diese URL einsetzen:
git remote add origin https://github.com/DEINUSERNAME/marcolips-website.git
git branch -M main
git push -u origin main
```

✅ **Fertig!** Dein Projekt ist jetzt auf GitHub!

---

### 2. Web Hoster Setup (3 Min)

#### Option A: FTP-Upload Skript verwenden (einfacher)

1. **FTP-Zugänge beschaffen** (von deinem Web Hoster)
   - Host: z.B. `ftp.deinedomain.de`
   - Benutzer: z.B. `benutzername`
   - Passwort: z.B. `passwort`

2. **Deploy-Konfiguration erstellen:**

Erstelle eine Datei `deploy-config.json` im Projektordner:

```json
{
  "ftp": {
    "host": "ftp.deinedomain.de",
    "user": "dein_ftp_benutzername",
    "password": "dein_ftp_passwort",
    "remotePath": "/public_html/",
    "port": 21
  }
}
```

3. **Hochladen:**

```powershell
cd c:\Dev\marcolips-website
.\deploy.ps1
```

🎉 **Fertig!** Deine Website ist online!

#### Option B: WinSCP verwenden (grafisch)

1. [WinSCP herunterladen](https://winscp.net/)
2. Mit deinem SFTP-Account verbinden
3. Dragg & Drop deine Dateien

---

### 3. Zukünftige Änderungen deployen

Nach jeder Änderung:

```powershell
cd c:\Dev\marcolips-website

# 1. Änderungen zu Git hinzufügen
git add .

# 2. Speichern (Commit)
git commit -m "Beschreibe deine Änderung"

# 3. Zu GitHub pushen
git push origin main

# 4. Zu Web Hoster hochladen
.\deploy.ps1
```

---

### 4. Von anderem PC arbeiten

```powershell
# Projekt klonen:
git clone https://github.com/DEINUSERNAME/marcolips-website.git
cd marcolips-website

# Änderungen machen...

# Und hochladen:
git add .
git commit -m "Änderung vom Laptop"
git push origin main
.\deploy.ps1
```

---

## 🔧 Troubleshooting

### Problem: "git not found"
**Lösung:** Git installieren von https://git-scm.com/download/win

### Problem: FTP-Upload schlägt fehl
**Lösung:** 
- FTP-Zugänge überprüfen
- Pfad in `deploy-config.json` korrekt? (z.B. `/public_html/` statt `/home/user/`)
- Auf deinem Hoster nachfragen

### Problem: Passwort wird nicht akzeptiert
**Lösung:** Spezialzeichen in JSON mit `\` escapen, z.B. `@` bleibt `@`, aber `"` wird `\"`

---

## 📊 Workflow Zusammenfassung

```
┌─────────────────────┐
│  Lokal bearbeiten   │
│  (VS Code)          │
└──────────┬──────────┘
           │ git push
           ▼
┌─────────────────────┐
│  GitHub Repository  │
│  (Backup & History) │
└──────────┬──────────┘
           │ .\deploy.ps1
           ▼
┌─────────────────────┐
│  Web Hoster (FTP)   │
│  (Live Website)     │
└─────────────────────┘
           │
           ▼
    https://deinedomain.de/
```

---

## 💡 Weitere Optionen (fortgeschritten)

### GitHub Pages (kostenlos hosten)
Wenn du GitHub Pages nutzt:
```powershell
git push origin main
# → Automatisch auf https://deinusername.github.io deployt!
```

### Automatisiertes Deployment mit GitHub Actions
Nach Einrichtung der Secrets:
```powershell
git push origin main
# → Automatisch zu FTP hochgeladen! (ohne .\deploy.ps1)
```

Siehe `DEPLOYMENT_GUIDE.md` für Details.

---

## ✨ Du bist fertig!

Dein Setup:
- ✅ Git/GitHub for Version Control
- ✅ FTP für Web Hoster Sync
- ✅ Deploy Script for easy uploads
- ✅ Bereit für Synchronisierung über mehrere Geräte

**Happy coding!** 🚀
