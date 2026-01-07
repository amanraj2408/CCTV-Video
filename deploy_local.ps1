$key = 'D:\Video-Stream\video-dashboard\.ssh\ec2.pem'
scp -i $key 'D:\Video-Stream\video-dashboard\video-dashboard-release.zip' ec2-user@15.207.65.123:~
scp -i $key 'D:\Video-Stream\video-dashboard\deploy_remote.sh' ec2-user@15.207.65.123:~
ssh -i $key ec2-user@15.207.65.123 'bash ~/deploy_remote.sh'
