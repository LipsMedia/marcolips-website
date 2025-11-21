# ✅ Setup Checkliste für GitHub & Web Hoster

## Schritt 1: GitHub vorbereiten

- [ ] GitHub Account erstellen: https://github.com/signup
- [ ] E-Mail bestätigen
- [ ] SSH Keys einrichten (optional aber empfohlen)

## Schritt 2: GitHub Repository erstellen

- [ ] Gehe zu https://github.com/new
- [ ] Repository Name: `marcolips-website`
- [ ] Beschreibung hinzufügen
- [ ] Wähle "Private" (nur dich sichtbar)
- [ ] Klick "Create repository"
- [ ] Kopiere die Repository-URL (HTTPS)

## Schritt 3: Lokales Projekt mit GitHub verbinden

Führe folgende Befehle aus:

```powershell
cd c:\Dev\marcolips-website

# Bereits gemacht! Aber hier zur Referenz:
# git config --global user.name "Marco Lips"
# git config --global user.email "deine@email.com"
# git remote add origin https://github.com/DEINUSERNAME/marcolips-website.git
# git branch -M main
# git push -u origin main
```

Status überprüfen:
```powershell
git remote -v
git log --oneline
```

- [ ] GitHub Remote URL ist korrekt
- [ ] Erstes Commit ist abgeschlossen
- [ ] `git log` zeigt dein Commit

## Schritt 4: FTP-Zugänge vom Web Hoster

Kontaktiere deinen Web Hoster und besorge:

- [ ] FTP Host: `________________`
- [ ] FTP Benutzer: `________________`
- [ ] FTP Passwort: `________________`
- [ ] Ziel-Ordner: `________________` (z.B. `/public_html/`)

## Schritt 5: Deploy-Konfiguration erstellen

Erstelle `deploy-config.json` im Projektordner:

```json
{
  "ftp": {
    "host": "DEIN_FTP_HOST",
    "user": "DEIN_FTP_BENUTZER",
    "password": "DEIN_FTP_PASSWORT",
    "remotePath": "/DEIN_ZIEL_ORDNER/",
    "port": 21
  }
}
```

- [ ] `deploy-config.json` erstellt
- [ ] FTP-Daten korrekt eingetragen
- [ ] **NICHT** zu Git hinzugefügt (ist bereits in .gitignore)

## Schritt 6: Erstes Deployment testen

```powershell
cd c:\Dev\marcolips-website
.\deploy.ps1
```

- [ ] Deployment-Skript läuft ohne Fehler
- [ ] Alle Dateien werden hochgeladen
- [ ] Website ist unter deiner Domain erreichbar

## Schritt 7: GitHub Actions einrichten (optional)

Für automatisiertes Deployment nach jedem Push:

1. Gehe zu deinem GitHub Repository
2. Klick "Settings"
3. Gehe zu "Secrets and variables" → "Actions"
4. Klick "New repository secret" und füge folgende Secrets hinzu:

- [ ] `FTP_HOST`: `ftp.deinedomain.de`
- [ ] `FTP_USER`: Dein FTP-Benutzer
- [ ] `FTP_PASS`: Dein FTP-Passwort
- [ ] `FTP_REMOTE_PATH`: `/public_html/marcolips-website/`

Nach der Einrichtung:
```powershell
git push origin main
# → GitHub Actions deployt automatisch!
```

## Schritt 8: Auf neuem Notebook einrichten

Wenn du auf einem anderen PC arbeiten möchtest:

```powershell
# Projekt klonen
git clone https://github.com/DEINUSERNAME/marcolips-website.git

# Oder: Neueste Änderungen fetchen (wenn Repo existiert)
git pull origin main

# FTP Deploy Config erstellen (nicht committed!)
# → Kopiere deploy-config.json oder erstelle sie neu
```

- [ ] Neuer PC kann klonen
- [ ] Deploy funktioniert auch dort

## Häufige Probleme & Lösungen

### Problem: "git: command not found"
- Lösung: Git installieren von https://git-scm.com/download/win

### Problem: "fatal: Could not read Username"
- Lösung: HTTPS statt SSH verwenden oder SSH-Keys einrichten

### Problem: Deploy schlägt bei FTP fehl
- [ ] Überprüfe FTP-Zugänge in `deploy-config.json`
- [ ] Prüfe ob der remote Ordner existiert
- [ ] Versuche manuell via WinSCP (https://winscp.net/)

### Problem: Passwort mit Spezialzeichen
- Lösung: In JSON mit `\` escapen oder in Anführungszeichen setzen

## Sicherheit & Best Practices

- [ ] `deploy-config.json` ist in `.gitignore` (Passwort-Schutz)
- [ ] Nutze "Private" Repository auf GitHub
- [ ] Regelmäßig Backups machen
- [ ] GitHub Secrets statt hardcoded Passwörter
- [ ] Nutze komplexe Passwörter für FTP

## Dein Workflow jetzt:

```
1. Änderungen in VS Code machen
2. git add . && git commit -m "Beschreibung"
3. git push origin main
4. .\deploy.ps1 (oder Auto via GitHub Actions)
5. Website updated! ✨
```

---

## Weitere Ressourcen

- Git Dokumentation: https://git-scm.com/doc
- GitHub Hilfe: https://docs.github.com
- Dein Hoster Support: Frag deinen Kundensupport bei Problemen

## Notizen

```
GitHub Repo: ________________________________
Web Hoster: ________________________________
FTP Host: ________________________________
Domain: ________________________________
```

---

**Glückwunsch!** Du hast ein professionelles Setup für deine Website! 🎉
