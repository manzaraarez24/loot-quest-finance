# Build the web application
Write-Host "Building web application..." -ForegroundColor Cyan
npm run build

# Define paths
$distDir = Join-Path $PSScriptRoot "dist"
$androidAssetsDir = Join-Path $PSScriptRoot "android-app\app\src\main\assets"

# Check if dist exists
if (-not (Test-Path $distDir)) {
    Write-Error "Build failed or dist directory not found!"
    exit 1
}

# Create Android assets directory if it doesn't exist
if (-not (Test-Path $androidAssetsDir)) {
    Write-Host "Creating Android assets directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path $androidAssetsDir
} else {
    Write-Host "Cleaning existing Android assets..." -ForegroundColor Yellow
    Remove-Item -Path "$androidAssetsDir\*" -Recurse -Force
}

# Copy assets
Write-Host "Copying assets to Android project..." -ForegroundColor Green
Copy-Item -Path "$distDir\*" -Destination $androidAssetsDir -Recurse -Force

Write-Host "Sync complete! You can now run the app in Android Studio." -ForegroundColor Cyan
