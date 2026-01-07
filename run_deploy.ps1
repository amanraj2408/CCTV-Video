$key = 'D:\Video-Stream\video-dashboard\.ssh\ec2.pem'
icacls $key /inheritance:r
icacls $key /remove 'NT AUTHORITY\Authenticated Users' 'BUILTIN\Users' 'Users' | Out-Null
icacls $key /grant:r "$env:USERNAME:F"
icacls $key
Start-Process -FilePath 'powershell' -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','D:\Video-Stream\video-dashboard\deploy_local.ps1' -Wait -NoNewWindow
