param(
	[string]$ConfigFile = "deploy-config.json"
)

# Load configuration from JSON
if (Test-Path $ConfigFile) {
	Write-Host "Konfiguration aus $ConfigFile wird geladen..." -ForegroundColor Cyan
	$config = Get-Content $ConfigFile -Raw | ConvertFrom-Json
	$FTP_HOST = $config.ftp.host
	$FTP_USER = $config.ftp.user
	$FTP_PASS = $config.ftp.password
	$FTP_REMOTE_PATH = $config.ftp.remotePath
	$FTP_PORT = $config.ftp.port
} else {
	Write-Host "WARNUNG: $ConfigFile nicht gefunden!" -ForegroundColor Yellow
	Write-Host "Bitte erstelle die Datei mit deinen FTP-Zugängen." -ForegroundColor Yellow
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

$LOCAL_PATH = (Get-Location).Path

function Connect-FTP {
	param([string]$Host, [string]$User, [string]$Password, [int]$Port = 21)
	try {
		$uri = "ftp://$Host/"
		$request = [System.Net.FtpWebRequest]::Create($uri)
		$request.Credentials = New-Object System.Net.NetworkCredential($User, $Password)
		$request.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
		$request.Timeout = 5000
		$response = $request.GetResponse(); $response.Close()
		return $true
	} catch { return $false }
}

function Upload-FileToFTP {
	param([string]$LocalFile, [string]$RemoteFile, [string]$Host, [string]$User, [string]$Password)
	try {
		$uri = "ftp://$Host/$RemoteFile"
		$request = [System.Net.FtpWebRequest]::Create($uri)
		$request.Credentials = New-Object System.Net.NetworkCredential($User, $Password)
		$request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
		$request.UseBinary = $true
		$fileContent = [System.IO.File]::ReadAllBytes($LocalFile)
		$request.ContentLength = $fileContent.Length
		$stream = $request.GetRequestStream(); $stream.Write($fileContent,0,$fileContent.Length); $stream.Close()
		$response = $request.GetResponse(); $response.Close()
		return $true
	} catch { Write-Host "   ❌ Fehler: $_" -ForegroundColor Red; return $false }
}

function Create-FTPDirectory {
	param([string]$RemoteDir, [string]$Host, [string]$User, [string]$Password)
	try {
		$uri = "ftp://$Host/$RemoteDir"
		$request = [System.Net.FtpWebRequest]::Create($uri)
		$request.Credentials = New-Object System.Net.NetworkCredential($User, $Password)
		$request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
		$request.Timeout = 5000
		$response = $request.GetResponse(); $response.Close()
		return $true
	} catch { return $true }
}

Write-Host "\n=== Marco Lips Website - FTP Deployment Script ===\n" -ForegroundColor Cyan
Write-Host "Teste FTP-Verbindung zu $FTP_HOST..." -ForegroundColor Yellow
if (-not (Connect-FTP -Host $FTP_HOST -User $FTP_USER -Password $FTP_PASS -Port $FTP_PORT)) {
	Write-Host "❌ Verbindung fehlgeschlagen! Überprüfe deine Anmeldedaten." -ForegroundColor Red
	exit 1
}
Write-Host "Verbindung erfolgreich!`n" -ForegroundColor Green

$files = Get-ChildItem -Path $LOCAL_PATH -Recurse -File | Where-Object {
	$_.FullName -notmatch '\.git' -and $_.FullName -notmatch 'node_modules' -and $_.Name -ne 'deploy-config.json' -and $_.Name -ne 'deploy.ps1' -and $_.Name -ne '.gitignore'
}

$totalFiles = $files.Count; $uploadedFiles = 0; $failedFiles = 0
Write-Host "Starte Upload ($totalFiles Dateien)...`n" -ForegroundColor Yellow

foreach ($file in $files) {
	$relativePath = $file.FullName.Substring($LOCAL_PATH.Length).TrimStart('\','/') -replace '\\','/'
	$remotePath = "$FTP_REMOTE_PATH$relativePath"
	$remoteDir = Split-Path $remotePath -Parent
	if ($remoteDir) { Create-FTPDirectory -RemoteDir $remoteDir -Host $FTP_HOST -User $FTP_USER -Password $FTP_PASS | Out-Null }
	Write-Host "Uploade: $relativePath" -NoNewline
	if (Upload-FileToFTP -LocalFile $file.FullName -RemoteFile $remotePath -Host $FTP_HOST -User $FTP_USER -Password $FTP_PASS) { Write-Host " OK" -ForegroundColor Green; $uploadedFiles++ } else { Write-Host " FAILED" -ForegroundColor Red; $failedFiles++ }
}

Write-Host "\n=== Deployment abgeschlossen ===\n" -ForegroundColor Cyan
Write-Host "Statistik:`n   Erfolgreich: $uploadedFiles / $totalFiles`n   Fehler: $failedFiles / $totalFiles`n"
Write-Host "Deine Website ist verfügbar unter: https://deinedomain.de/marcolips-website/`n" -ForegroundColor Green
