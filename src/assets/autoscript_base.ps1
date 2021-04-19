if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator"))  
{  
    Write-Host "Not running as admin"
    $arguments = "-executionpolicy bypass & '" +$myinvocation.mycommand.definition + "'"
    Start-Process powershell -Verb runAs -ArgumentList $arguments
    Exit
}
Write-Host "Running as admin!"
Write-Host "Checking if chocolatey is installed or not..."
choco -v | Out-Null
if ($? -ne $True) {
    Write-Host "Chocolatey is not installed! Installing..."
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    Write-Host "Checking if chocolatey install was successful..."
    choco -v | Out-Null
    if ($? -ne $True) {
        Write-Host "Chocolaty failed to install, can't continue :("
        Write-Host "Check if your network settings are correct and nothing blocks Chocolatey websites (e.g.: chocolatey.org, community.chocolatey.org)"
        Pause
        Exit
    }
}
