start npm run make

del "out\make\squirrel.windows\x64\TubeCommander-1.0.0 Setup.exe"
del "out\make\squirrel.windows\x64\TubeCommander.exe"

@echo off
:checkfile
if exist "out\make\squirrel.windows\x64\TubeCommander-1.0.0 Setup.exe" (
    echo Make complete. Publishing...
    goto publish
) else (
    echo Waiting on make...
    timeout /t 5 /nobreak > nul
    goto checkfile
)

:publish
    gh release delete v1.0.0 -y --cleanup-tag
    move "out\make\squirrel.windows\x64\TubeCommander-1.0.0 Setup.exe" "out\make\squirrel.windows\x64\TubeCommander.exe"
    gh release create v1.0.0 "out\make\squirrel.windows\x64\TubeCommander.exe" --title "TubeCommander Only Release" --notes "This release will always contain the latest code."