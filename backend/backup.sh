#!/bin/sh
while true; do
    timestamp=$(date +%Y%m%d_%H%M%S)
    tar -czf /backup/pb_backups/backup_$timestamp.tar.gz -C /backup pb_data
    find /backup/pb_backups -type f -mtime +7 -delete
    sleep 86400
done
