$ErrorActionPreference = 'Stop'

$repoUrl = 'https://github.com/skobar31sv-pixel/excomercafe-sistema.git'
$branch = 'main'
$root = Split-Path -Parent $PSScriptRoot

Set-Location -LiteralPath $root

function Fail($message) {
  Write-Host ''
  Write-Host $message -ForegroundColor Red
  exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Fail 'Git no esta instalado o no esta en el PATH. Instala Git for Windows y vuelve a ejecutar subir-github.bat.'
}

if (-not (Test-Path -LiteralPath '.git')) {
  Write-Host 'Conectando esta carpeta con GitHub por primera vez...'
  git init
  git remote add origin $repoUrl
  git fetch origin $branch
  git checkout -B $branch
  git reset --mixed "origin/$branch"
} else {
  $remote = git remote get-url origin 2>$null
  if (-not $remote) {
    git remote add origin $repoUrl
  }
  git checkout $branch
  git fetch origin $branch
}

Write-Host ''
Write-Host 'Archivos modificados/locales:'
git status --short

$hasChanges = git status --porcelain
if (-not $hasChanges) {
  Write-Host ''
  Write-Host 'No hay cambios nuevos para subir.' -ForegroundColor Green
  exit 0
}

$defaultMessage = 'Actualiza sistema desde PC local'
$message = Read-Host "Mensaje del cambio [$defaultMessage]"
if ([string]::IsNullOrWhiteSpace($message)) {
  $message = $defaultMessage
}

git add -A
git commit -m $message
git push -u origin $branch

Write-Host ''
Write-Host 'Listo: cambios subidos a GitHub.' -ForegroundColor Green
