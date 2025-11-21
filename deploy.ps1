# Marco Lips Website - FTP Deploy Script
# Dieses Skript lädt deine Website auf deinen Web Hoster hoch

param(
    [string]$ConfigFile = "deploy-config.json"
)

# ============================================
# KONFIGURATION
# ============================================

# Versuche, Konfiguration aus JSON-Datei zu laden
if (Test-Path $ConfigFile) {
    Write-Host "📂 Konfiguration aus $ConfigFile wird geladen..." -ForegroundColor Cyan
    $config = Get-Content $ConfigFile | ConvertFrom-Json
    
    $FTP_HOST = $config.ftp.host
    $FTP_USER = $config.ftp.user
    $FTP_PASS = $config.ftp.password
    $FTP_REMOTE_PATH = $config.ftp.remotePath
    $FTP_PORT = $config.ftp.port
} else {
    Write-Host "⚠️  Warnung: $ConfigFile nicht gefunden!" -ForegroundColor Yellow
    Write-Host "   Bitte erstelle die Datei mit deinen FTP-Zugängen." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Beispiel deploy-config.json:" -ForegroundColor Green
    Write-Host @'
{
  "ftp": {
    "host": "ftp.deinedomain.de",
    "user": "dein_benutzer",
    "password": "dein_passwort",
    "remotePath": "/public_html/marcolips-website/",
    "port": 21
  }
}
'@
    exit 1
}

$LOCAL_PATH = Get-Location

# ============================================
# FUNKTIONEN
# ============================================

function Connect-FTP {
    param(
        [string]$Host,
        [string]$User,
        [string]$Password,
        [int]$Port = 21
    )
    
    try {
        $uri = "ftp://$Host/"
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Credentials = New-Object System.Net.NetworkCredential($User, $Password)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
        $request.Timeout = 5000
        
        $response = $request.GetResponse()
        $response.Close()
        
        return $true
    } catch {
        return $false
    }
}

function Upload-FileToFTP {
    param(
        [string]$LocalFile,
        [string]$RemoteFile,
        [string]$Host,
        [string]$User,
        [string]$Password
    )
    
    try {
        $uri = "ftp://$Host/$RemoteFile"
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Credentials = New-Object System.Net.NetworkCredential($User, $Password)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $request.UseBinary = $true
        $request.Timeout = 10000
        
        $fileContent = [System.IO.File]::ReadAllBytes($LocalFile)
        $request.ContentLength = $fileContent.Length
        
        $stream = $request.GetRequestStream()
        $stream.Write($fileContent, 0, $fileContent.Length)
        $stream.Close()
        
        $response = $request.GetResponse()
        $response.Close()
        
        return $true
    } catch {
        Write-Host "   ❌ Fehler: $_" -ForegroundColor Red
        return $false
    }
}

function Create-FTPDirectory {
    param(
        [string]$RemoteDir,
        [string]$Host,
        [string]$User,
        [string]$Password
    )
    
    try {
        $uri = "ftp://$Host/$RemoteDir"
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Credentials = New-Object System.Net.NetworkCredential($User, $Password)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $request.Timeout = 5000
        
        $response = $request.GetResponse()
        $response.Close()
        
        return $true
    } catch {
        # Verzeichnis existiert wahrscheinlich bereits
        return $true
    }
}

# ============================================
# MAIN
# ============================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Marco Lips Website - FTP Deployment Script              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Test FTP-Verbindung
Write-Host "🔌 Teste FTP-Verbindung zu $FTP_HOST..." -ForegroundColor Yellow
if (Connect-FTP -Host $FTP_HOST -User $FTP_USER -Password $FTP_PASS -Port $FTP_PORT) {
    Write-Host "✅ Verbindung erfolgreich!" -ForegroundColor Green
} else {
    Write-Host "❌ Verbindung fehlgeschlagen! Überprüfe deine Anmeldedaten." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Dateienliste vorbereiten
$files = Get-ChildItem -Path $LOCAL_PATH -Recurse -File | Where-Object {
    $_.FullName -notmatch '\.git' -and `
    $_.FullName -notmatch 'node_modules' -and `
    $_.Name -ne 'deploy-config.json' -and `
    $_.Name -ne 'deploy.ps1' -and `
    $_.Name -ne '.gitignore'
}

$totalFiles = $files.Count
$uploadedFiles = 0
$failedFiles = 0

Write-Host "📤 Starte Upload ($totalFiles Dateien)..." -ForegroundColor Yellow
Write-Host ""

foreach ($file in $files) {
    $relativePath = $file.FullName.Replace($LOCAL_PATH, "").Replace("\", "/").TrimStart("/")
    $remotePath = "$FTP_REMOTE_PATH$relativePath"
    
    # Verzeichnis erstellen (falls nötig)
    $remoteDir = Split-Path -Parent $remotePath | ForEach-Object { $_.Replace($FTP_REMOTE_PATH, "").TrimEnd("/") }
    if ($remoteDir) {
        Create-FTPDirectory -RemoteDir "$FTP_REMOTE_PATH$remoteDir" -Host $FTP_HOST -User $FTP_USER -Password $FTP_PASS | Out-Null
    }
    
    # Datei hochladen
    Write-Host "📄 Uploade: $relativePath" -NoNewline
    if (Upload-FileToFTP -LocalFile $file.FullName -RemoteFile $remotePath -Host $FTP_HOST -User $FTP_USER -Password $FTP_PASS) {
        Write-Host " ✅" -ForegroundColor Green
        $uploadedFiles++
    } else {
        Write-Host " ❌" -ForegroundColor Red
        $failedFiles++
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  Deployment Abgeschlossen                  ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Statistik:" -ForegroundColor Cyan
Write-Host "   ✅ Erfolgreich: $uploadedFiles / $totalFiles"
Write-Host "   ❌ Fehler: $failedFiles / $totalFiles"
Write-Host ""
Write-Host "🌐 Deine Website ist verfügbar unter:" -ForegroundColor Green
Write-Host "   https://deinedomain.de/marcolips-website/" -ForegroundColor Green
Write-Host ""
