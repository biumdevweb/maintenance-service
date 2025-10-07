# Script PowerShell per sync automatico con GitHub
# Maintenance Service - Auto Sync Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " GitHub Sync - Maintenance Service" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Controlla se Git e installato
try {
    $gitVersion = git --version 2>$null
    Write-Host "✓ Git trovato: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRORE: Git non e installato o non e nel PATH del sistema." -ForegroundColor Red
    Write-Host "  Per favore installa Git da https://git-scm.com/" -ForegroundColor Yellow
    Read-Host "Premi Invio per uscire"
    exit 1
}

Write-Host ""

# Vai alla directory del progetto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath
Write-Host "Directory corrente: $(Get-Location)" -ForegroundColor Gray
Write-Host ""

# Controlla se siamo in un repository Git
if (-not (Test-Path ".git")) {
    Write-Host "✗ ERRORE: Questa non e una directory Git." -ForegroundColor Red
    Write-Host "  Assicurati di aver inizializzato il repository Git." -ForegroundColor Yellow
    Read-Host "Premi Invio per uscire"
    exit 1
}

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
$pullResult = git pull origin main 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ ATTENZIONE: Pull fallito. Potrebbero esserci conflitti da risolvere." -ForegroundColor Yellow
    Write-Host "  Continuo con il push..." -ForegroundColor Yellow
} else {
    Write-Host "✓ Pull completato con successo" -ForegroundColor Green
}
Write-Host ""

# Esegui push per caricare le modifiche
Write-Host "5. Caricamento modifiche su GitHub (push)..." -ForegroundColor Blue
$pushResult = git push origin main 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ ERRORE: Push fallito." -ForegroundColor Red
    Write-Host "  Controlla le tue credenziali Git o la connessione internet." -ForegroundColor Yellow
    Write-Host "  Dettagli errore: $pushResult" -ForegroundColor Red
    Read-Host "Premi Invio per uscire"
    exit 1
} else {
    Write-Host "✓ Push completato con successo" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " SYNC COMPLETATO CON SUCCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repository maintenance-service sincronizzato con GitHub alle $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray
Write-Host "Repository URL: https://github.com/biumdevweb/maintenance-service.git" -ForegroundColor Gray
Write-Host ""
Read-Host "Premi Invio per uscire"