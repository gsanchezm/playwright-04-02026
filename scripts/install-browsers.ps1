# Instala los navegadores de Playwright en maquinas con IPv6 roto.
# El descargador de Playwright intenta IPv6 primero y aborta al fallar; curl por IPv4 si funciona.
# Uso: pwsh scripts/install-browsers.ps1 [chromium firefox webkit ...]
param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Browsers = @())

$ErrorActionPreference = 'Stop'
$mirror = Join-Path $env:TEMP 'playwright-mirror'
$port = 8787
New-Item -ItemType Directory -Force $mirror | Out-Null

$dryRun = (& pnpm exec playwright install --dry-run @Browsers 2>&1 | Out-String)
$urls = [regex]::Matches($dryRun, 'Download url:\s+(\S+)') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
if (-not $urls) { throw "No se obtuvieron URLs de descarga.`n$dryRun" }

foreach ($u in $urls) {
  $path = ([uri]$u).AbsolutePath.TrimStart('/')
  # Con PLAYWRIGHT_DOWNLOAD_HOST Playwright pide la ruta sin el prefijo dbazure/download/playwright/
  $shortPath = $path -replace '^dbazure/download/playwright/', ''
  $dest = Join-Path $mirror $shortPath
  if (Test-Path $dest) { Write-Host "ya existe: $shortPath"; continue }
  New-Item -ItemType Directory -Force (Split-Path $dest) | Out-Null
  Write-Host "descargando (IPv4): $u"
  & curl.exe -4 -sS -L --retry 3 -o $dest $u
  if ($LASTEXITCODE -ne 0) { throw "fallo la descarga de $u" }
}

$server = Start-Process python -ArgumentList '-m','http.server',"$port",'--bind','127.0.0.1' -WorkingDirectory $mirror -PassThru -WindowStyle Hidden
try {
  Start-Sleep -Seconds 2
  $env:PLAYWRIGHT_DOWNLOAD_HOST = "http://127.0.0.1:$port"
  & pnpm exec playwright install @Browsers
} finally {
  Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
  Remove-Item Env:PLAYWRIGHT_DOWNLOAD_HOST -ErrorAction SilentlyContinue
}
