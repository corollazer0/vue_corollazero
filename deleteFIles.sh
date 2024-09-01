#!/bin/bash

###########################
#기존 old, new dir files 초기화
rm -f C:\Users\corol\Desktop\test\assets_old
rm -f C:\Users\corol\Desktop\test\assets_new
#기존 assets -> assets_old로 복사
cp /dist/assets/* dist/assets_old/
#build
vite build
#build 결과물 assets_new로 복사
cp /dist/assets/* dist/assets_new
#old와new 비교하여 삭제 file 목록 작성
#삭제 기준
#1. 파일명이 같은데 해시값이 다른 경우
#2. assets_old에는 있는데, assets_new에는 없는 경우
#node processMaps.js /path/to/old_assets /path/to/new_assets
node processMaps.js C:\Users\corol\Desktop\test\assets_old C:\Users\corol\Desktop\test\assets_new
#############################
#이하 운영에서 수행하는 롲기
#배포된 경로에서 삭제 fileList 삭제
#############################
# Define the directory where the files to be deleted are located
assetsDir="dist/assets"

# Check if deleteFiles.txt exists
if [ ! -f "deleteFiles.txt" ]; then
    echo "deleteFiles.txt not found. Exiting."
    exit 1
fi

# Read each line from deleteFiles.txt and delete the corresponding file
while IFS= read -r filename; do
    # Construct the full path of the file to delete
    filePath="$assetsDir/$filename"

    # Check if the file exists
    if [ -f "$filePath" ]; then
        echo "Deleting file: $filePath"
        rm -f "$filePath"
    else
        echo "File not found: $filePath"
    fi
done < "deleteFiles.txt"

echo "File deletion process completed."
