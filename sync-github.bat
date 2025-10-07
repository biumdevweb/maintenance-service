@echo off
echo ========================================
echo  GitHub Sync - Maintenance Service
echo ========================================
echo.

:: Controlla se Git è installato
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRORE: Git non è installato o non è nel PATH del sistema.
    echo Per favore installa Git da https://git-scm.com/
    pause
    exit /b 1
)

echo Git è installato. Inizio sincronizzazione...
echo.

:: Vai alla directory del progetto
cd /d "%~dp0"
echo Directory corrente: %CD%
echo.

:: Controlla se siamo in un repository Git
if not exist ".git" (
    echo ERRORE: Questa non è una directory Git.
    echo Assicurati di aver inizializzato il repository Git.
    pause
    exit /b 1
)

:: Mostra lo stato corrente
echo 1. Controllo stato repository...
git status
echo.

:: Aggiungi tutti i file modificati
echo 2. Aggiunta file modificati...
git add .
echo.

:: Crea un commit con timestamp automatico
echo 3. Creazione commit...
:: Utilizzo del comando date e time come alternativa a wmic
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "dt=%%I" 2>nul
if "%dt%"=="" (
    :: Metodo alternativo se wmic non è disponibile
    for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set "dt=%%c-%%a-%%b"
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set "tm=%%a:%%b"
    set "timestamp=%dt% %tm%"
) else (
    set "YYYY=%dt:~0,4%"
    set "MM=%dt:~4,2%"
    set "DD=%dt:~6,2%"
    set "HH=%dt:~8,2%"
    set "Min=%dt:~10,2%"
    set "Sec=%dt:~12,2%"
    set "timestamp=%YYYY%-%MM%-%DD% %HH%:%Min%:%Sec%"
)

git commit -m "Auto-sync %timestamp% - Aggiornamento maintenance service"
echo.

:: Esegui pull per sincronizzare con il repository remoto
echo 4. Sincronizzazione con repository remoto (pull)...
git pull origin main
if %errorlevel% neq 0 (
    echo ATTENZIONE: Pull fallito. Potrebbero esserci conflitti da risolvere.
    echo Continuo con il push...
)
echo.

:: Esegui push per caricare le modifiche
echo 5. Caricamento modifiche su GitHub (push)...
git push origin main
if %errorlevel% neq 0 (
    echo ERRORE: Push fallito.
    echo Controlla le tue credenziali Git o la connessione internet.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SYNC COMPLETATO CON SUCCESSO!
echo ========================================
echo.
echo Repository maintenance-service sincronizzato con GitHub alle %time%
echo Repository URL: https://github.com/biumdevweb/maintenance-service.git
echo.
pause