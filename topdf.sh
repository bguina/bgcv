#!/usr/bin/env bash

# Get the front page in printable layout and save as pdf.
# Requirements: 
#	apt-get install xvfb wkhtmltopdf

xvfb-run wkhtmltopdf --zoom .71 -s A4 http://localhost:7000/?aspdf=1 public/cv.pdf
