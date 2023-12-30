#!/usr/bin/env bash
set -x
app="/home/wumbl3vps/Dev/bingchilling-game"
cd $app
source pyvenv/bin/activate
gunicorn --error-logfile "${app}/server/log/gunicorn/error.log" --access-logfile "${app}/server/log/gunicorn/access.log" --capture-output --log-level debug -k eventlet -w 1 --bind unix:"${app}/server/sock.sock" -m 007 app:app
