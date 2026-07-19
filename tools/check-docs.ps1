# check-docs.ps1 - lokales CI-Pruefskript (Beschluss E7 vom 17.07.2026)
# Prueft alle .md/.txt unter docs\ und Dual-layer\ auf:
#   1. gueltige UTF-8-Kodierung
#   2. Mojibake-Muster (Folge der bekannten Kodierungsfehler-Historie)
#   3. tote relative Markdown-Links
#   4. Platzhalter (TODO/TBD/FIXME) in Konzeptdokumenten unter docs\
# Exit-Code 0 = alles in Ordnung, 1 = Befunde. Aufruf auch per pre-commit-Hook.
# Dateien unter protokolle\ sind historisch und werden bewusst NICHT geprueft.
# Dieses Skript ist absichtlich reines ASCII; Sonderzeichen nur als \uXXXX-Regex-Escapes.

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$befunde = New-Object System.Collections.Generic.List[string]

# U+FFFD = Ersatzzeichen; U+00C3 vor U+0080-00FF bzw. U+00E2 vor U+20AC sind
# typische Reste doppelt kodierter deutscher Umlaute/Anfuehrungszeichen.
$mojibake = @(
    @{ muster = [string][char]0xFFFD; name = 'Ersatzzeichen U+FFFD' }
    @{ muster = ([string][char]0xC3) + '[' + [string][char]0x80 + '-' + [string][char]0xFF + ']'; name = 'Doppelt kodiertes UTF-8 (C3-Sequenz)' }
    @{ muster = ([string][char]0xE2) + [string][char]0x20AC; name = 'Doppelt kodiertes UTF-8 (E2-80-Sequenz)' }
)

$strictUtf8 = New-Object System.Text.UTF8Encoding($false, $true)  # wirft bei ungueltigen Bytes

$dateien = @()
foreach ($ordner in @('docs', 'Dual-layer')) {
    $pfad = Join-Path $repoRoot $ordner
    if (Test-Path $pfad) {
        $dateien += Get-ChildItem -Path $pfad -Recurse -File -Include *.md, *.txt
    }
}

foreach ($datei in $dateien) {
    $relativ = $datei.FullName.Substring($repoRoot.Length + 1)
    $bytes = [System.IO.File]::ReadAllBytes($datei.FullName)

    # 1. UTF-8-Gueltigkeit
    $text = $null
    try {
        $text = $strictUtf8.GetString($bytes)
    } catch {
        $befunde.Add("$relativ : keine gueltige UTF-8-Datei")
        continue
    }

    # 2. Mojibake
    foreach ($m in $mojibake) {
        $treffer = [regex]::Matches($text, $m.muster)
        if ($treffer.Count -gt 0) {
            $befunde.Add("$relativ : $($treffer.Count)x $($m.name)")
        }
    }

    # 3. tote relative Links (nur Markdown)
    if ($datei.Extension -eq '.md') {
        foreach ($link in [regex]::Matches($text, '\[[^\]]*\]\(([^)#\s]+)[^)]*\)')) {
            $ziel = $link.Groups[1].Value
            if ($ziel -match '^(https?:|mailto:|#)') { continue }
            $zielPfad = Join-Path $datei.DirectoryName ([uri]::UnescapeDataString($ziel))
            if (-not (Test-Path $zielPfad)) {
                $befunde.Add("$relativ : toter Link -> $ziel")
            }
        }
    }

    # 4. Platzhalter nur in Konzeptdokumenten (docs\)
    if ($relativ -like 'docs*') {
        foreach ($p in [regex]::Matches($text, '\b(TODO|TBD|FIXME)\b')) {
            $befunde.Add("$relativ : Platzhalter '$($p.Value)'")
        }
    }
}

# 5. Katalog-Pruefungen (AP4, Beschluss B5/V3): nur wenn Katalog + Python vorhanden
$katalog = Join-Path $repoRoot 'katalog\bausteine'
if ((Test-Path $katalog) -and (Get-Command python -ErrorAction SilentlyContinue)) {
    foreach ($skript in @('tools\validate_katalog.py', 'tools\check_profil.py', 'tools\graph_export.py')) {
        $pfad = Join-Path $repoRoot $skript
        if (Test-Path $pfad) {
            & python $pfad | Out-Null
            if ($LASTEXITCODE -ne 0) { $befunde.Add("$skript : Befunde (erneut direkt aufrufen fuer Details)") }
        }
    }
}

Write-Host ("check-docs: {0} Datei(en) geprueft." -f $dateien.Count)
if ($befunde.Count -gt 0) {
    Write-Host "BEFUNDE:" -ForegroundColor Red
    $befunde | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    exit 1
}
Write-Host "Alles in Ordnung." -ForegroundColor Green
exit 0
