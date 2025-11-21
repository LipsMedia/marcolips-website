# Marco Lips - Private Website

Eine moderne, interaktive private Webseite mit verschiedenen Testing-Tools und Funktionen.

## Features

### 🎨 Designmerkmale
- **Modernes, responsives Design** - Funktioniert auf allen Geräten (Desktop, Tablet, Mobile)
- **Gradient-Hintergründe** - Attraktive Farbverläufe
- **Smooth Scrolling** - Sanfte Navigation zwischen Abschnitten
- **Sticky Navigation** - Navigation bleibt während des Scrollens sichtbar

### 🛠️ Interaktive Tools

#### 1. **Rechner**
- Basis-Arithmetik (Addition, Subtraktion, Multiplikation, Division)
- Schutz vor Division durch Null
- Dezimalzahlen-Unterstützung mit automatischer Rundung

#### 2. **Todo-Liste**
- Aufgaben hinzufügen und löschen
- Aufgaben als erledigt markieren
- Persistente Speicherung im LocalStorage
- Keyboard-Unterstützung (Enter zum Hinzufügen)

#### 3. **Farbgenerator**
- Zufällige Farbgenerierung
- Farbe manuell eingeben (Hex-Format)
- RGB-Wert-Anzeige
- Farbvorschau mit Hover-Effekt

#### 4. **Wetter-Simulator**
- Vier Wettertypen: Sonnig, Bewölkt, Regnerisch, Schneeig
- Temperatur-Schieberegler (-20°C bis +40°C)
- Emoji-Anzeige für Wettertypen

#### 5. **Text-Converter**
- Zu Großbuchstaben umwandeln
- Zu Kleinbuchstaben umwandeln
- Text umkehren
- Live-Vorschau während der Eingabe

#### 6. **Countdown-Timer**
- Benutzerdefinierte Sekundenzahl
- Start/Stop/Reset-Funktionen
- Audio-Benachrichtigung bei Ablauf
- MM:SS-Format-Anzeige

### 📝 Schnellnotizen
- Notizen mit Titel erstellen
- Automatische Zeitstempel
- Notizen als Karten anzeigen
- Löschen von Notizen
- LocalStorage-Persistierung

### 🎨 Galerie
- Gradient-Galerien-Items
- Hover-Effekte
- Responsive Grid-Layout

### 📧 Kontaktformular
- Einfaches Formular mit Name, Email, Nachricht
- Formularvalidierung
- Erfolgs-/Fehlermeldungen
- Submit-Button mit Feedback

## Technologie-Stack

- **HTML5** - Semantische Struktur
- **CSS3** - Modern, mit Custom Properties und Flexbox/Grid
- **JavaScript (Vanilla)** - Keine Dependencies
- **LocalStorage API** - Datenpersistierung

## Dateistruktur

```
marcolips-website/
├── index.html      # HTML-Struktur und Inhalt
├── styles.css      # Alle Stile und Responsivität
├── script.js       # JavaScript-Logik und Interaktivität
└── README.md       # Diese Datei
```

## Installation & Verwendung

1. Öffne `index.html` einfach in einem modernen Webbrowser
2. Keine Installation oder Dependencies erforderlich
3. Alle Tools funktionieren offline

## Browser-Kompatibilität

- Chrome (empfohlen)
- Firefox
- Safari
- Edge
- Mobile Browser

## Funktionsdetails

### LocalStorage-Nutzung
- **todos** - Array von Todo-Objekten
- **notes** - Array von Notizobjekten

Daten werden automatisch gespeichert und geladen.

### Responsives Design Breakpoints
- **Desktop**: > 768px (optimiert für große Bildschirme)
- **Tablet**: 480px - 768px
- **Mobile**: < 480px

### Keyboard-Shortcuts
- **Todo-Input**: Enter zum Hinzufügen
- **Note-Text**: Ctrl+Enter zum Speichern
- **Navigation**: Alle Links sind mit Tab navigierbar

## Color Scheme

- **Primary**: #667eea (Violett)
- **Secondary**: #764ba2 (Dunkelviolett)
- **Accent**: #f5576c (Pink/Rot)
- **Background**: #f9f9f9 (Hellgrau)
- **Text**: #333 (Dunkelgrau)

## Geplante Verbesserungen

- [ ] Dunkler Modus
- [ ] Weitere Rechner-Funktionen (Potenz, Wurzel, etc.)
- [ ] Notiz-Kategorien
- [ ] Theme-Anpassung
- [ ] Export-Funktionen für Daten
- [ ] Multiple Sprachen

## Lizenz

Privat - Nur zur persönlichen Verwendung

## Autor

Marco Lips - 2025

---

**Viel Spaß beim Testen und Erkunden der verschiedenen Funktionen!** 🚀
