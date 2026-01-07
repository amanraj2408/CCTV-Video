New-Item -ItemType Directory -Path 'C:\temp_deploy' -Force | Out-Null
Copy-Item 'D:\Video-Stream\video-dashboard\video-dashboard-release.zip' 'C:\temp_deploy\'
Copy-Item 'D:\Video-Stream\video-dashboard\deploy_remote.sh' 'C:\temp_deploy\'
Copy-Item 'D:\Video-Stream\video-dashboard\.ssh\video-dashboard-key.pem' 'C:\temp_deploy\'

# Fix key permissions
$key = 'C:\temp_deploy\video-dashboard-key.pem'
icacls $key /inheritance:r | Out-Null
icacls $key /remove 'NT AUTHORITY\Authenticated Users' 'BUILTIN\Users' 'Users' | Out-Null
icacls $key /grant "$env:USERNAME`:F" | Out-Null

# Verify permissions
Write-Output "Key permissions fixed. Now SCPing files..."

# SCP files to EC2
scp -i $key 'C:\temp_deploy\video-dashboard-release.zip' ec2-user@15.207.65.123:~
scp -i $key 'C:\temp_deploy\deploy_remote.sh' ec2-user@15.207.65.123:~

# Run deploy script
ssh -i $key ec2-user@15.207.65.123 'bash ~/deploy_remote.sh'

# Cleanup
Remove-Item 'C:\temp_deploy' -Recurse -Force

Write-Output "Deployment complete!"
