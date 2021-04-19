if ($?) {
    Write-Host "Done!" -ForegroundColor Green
} else {
    Write-Host "Done, but with errors."  -ForegroundColor white -BackgroundColor red
}
Pause