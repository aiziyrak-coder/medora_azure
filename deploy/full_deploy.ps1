# MedoraAI — to'liq deploy: commit, push, serverda pull + migrate + build + restart
# Ishga tushirish: .\deploy\full_deploy.ps1   yoki   pwsh -File deploy\full_deploy.ps1
# Shart: git sozlangan, repo origin/main ga push qilish huquqi bor

$ErrorActionPreference = "Stop"
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
if (-not (Test-Path (Join-Path $root "backend"))) { $root = (Get-Location).Path }
Set-Location $root

Write-Host "=== 1. Git ===" -ForegroundColor Cyan
git add -A
git diff --cached --quiet 2>$null; $hasStaged = $LASTEXITCODE -ne 0
if ($hasStaged) {
    Write-Host "O'zgarishlar commit qilinadi..."
    git commit -m "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
} else {
    Write-Host "Commit qilinadigan o'zgarish yo'q."
}
Write-Host "Push origin main..."
git push origin main

Write-Host ""
Write-Host "=== 2. Serverda: pull + migrate + build + restart ===" -ForegroundColor Cyan
& python deploy/deploy_remote.py
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Tugadi. https://medora.cdcgroup.uz - brauzerda Ctrl+Shift+R bilan yangilang." -ForegroundColor Green
