# Script PowerShell semplificato per sync con GitHub
# Maintenance Service - Auto Sync Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " GitHub Sync - Maintenance Service" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vai alla directory del progetto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath
Write-Host "Directory corrente: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# Mostra lo stato corrente
Write-Host "1. Controllo stato repository..." -ForegroundColor Blue
git status
Write-Host ""

# Aggiungi tutti i file modificati
Write-Host "2. Aggiunta file modificati..." -ForegroundColor Blue
git add .
Write-Host ""

# Crea un commit con timestamp automatico
Write-Host "3. Creazione commit..." -ForegroundColor Blue
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMessage = "Auto-sync $timestamp - Aggiornamento maintenance service"
git commit -m $commitMessage
Write-Host ""

# Esegui pull per sincronizzare con il repository remoto
Write-Host "4. Sincronizzazione con repository remoto (pull)..." -ForegroundColor Blue
git pull origin main
Write-Host ""

# Esegui push per caricare le modifiche
Write-Host "5. Caricamento modifiche su GitHub (push)..." -ForegroundColor Blue
git push origin main
Write-Host ""

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " SYNC COMPLETATO CON SUCCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repository maintenance-service sincronizzato con GitHub alle $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
Write-Host "Repository URL: https://github.com/biumdevweb/maintenance-service.git" -ForegroundColor Gray
Write-Host ""
Read-Host "Premi Invio per uscire"