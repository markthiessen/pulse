[CmdletBinding()]
param (
       [Parameter(Mandatory=$TRUE)]
       [Int] $BuildNumber
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

#download nuget.exe for package restore
$sourceNugetExe = "http://nuget.org/nuget.exe"
$targetNugetExe = "$scriptRoot\nuget.exe"

$nugetExists = Test-Path $targetNugetExe
if($nugetExists -ne $true){
	Invoke-WebRequest $sourceNugetExe -OutFile $targetNugetExe
}

& .\nuget.exe pack pulse.nuspec -Version "1.0.0.$BuildNumber"