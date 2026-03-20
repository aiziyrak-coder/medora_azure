# Serverda to'liq deploy (SSH orqali). Kalit yoki parol bilan kirish kerak.
#   $env:DEPLOY_HOST = "server-ip"
#   $env:DEPLOY_USER = "root"
#   $env:DEPLOY_SSH_KEY = "C:\path\to\id_ed25519"   # ixtiyoriy
#   $env:DEPLOY_APP = "/root/medoraai"               # ixtiyoriy, default /root/medoraai
#
# Ishlatish:  .\deploy\remote-deploy.ps1

$ErrorActionPreference = "Stop"
if (-not $env:DEPLOY_HOST) {
    Write-Host "DEPLOY_HOST yo'q. Misol:" -ForegroundColor Yellow
    Write-Host '  $env:DEPLOY_HOST="1.2.3.4"; $env:DEPLOY_USER="root"; .\deploy\remote-deploy.ps1' -ForegroundColor Gray
    exit 1
}
$user = if ($env:DEPLOY_USER) { $env:DEPLOY_USER } else { "root" }
$app = if ($env:DEPLOY_APP) { $env:DEPLOY_APP } else { "/root/medoraai" }
$target = "${user}@$($env:DEPLOY_HOST)"
$sshArgs = @("-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=accept-new")
if ($env:DEPLOY_SSH_KEY -and (Test-Path $env:DEPLOY_SSH_KEY)) {
    $sshArgs += "-i", $env:DEPLOY_SSH_KEY
}
$remoteCmd = "cd $app && git fetch origin main && git reset --hard origin/main && sudo bash deploy/server-deploy.sh"
Write-Host "SSH $target -> $app" -ForegroundColor Cyan
& ssh @sshArgs $target $remoteCmd
