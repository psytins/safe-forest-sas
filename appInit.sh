#!/bin/bash

# Update package list and install FFmpeg
apt-get update

# Install Python dependencies
apt-get install -y python3-flask
apt-get install -y python3-pillow
apt-get install -y python3-numpy
apt-get install -y python3-opencv

python3 yoloServer-v1.py
