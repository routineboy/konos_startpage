#!/usr/bin/env python
import ftplib
import sys
import os
import re

song_url = sys.argv[1]
playlist_name = sys.argv[2]

file = open("downloader.bat", "w")
file.write("youtube-dl -f 140 https://www.youtube.com/watch?v=" + song_url)
file.close()

print "life"
os.system("start downloader.bat")