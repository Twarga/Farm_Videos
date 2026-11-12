#!/bin/bash
JOB="/home/tlab/oday/factory/jobs/2026-11-11-all-types-of-asses"
ffmpeg -y -loglevel error -i "$JOB/final/final.mp4" -vf "fps=1/30,scale=320:-1,tile=5x6" "$JOB/final/qc_contact.png" && echo "QC sheet at $JOB/final/qc_contact.png"
