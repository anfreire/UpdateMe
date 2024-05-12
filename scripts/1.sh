#!/bin/bash




# Get all the user arguments
ARGS = $@

# FILTER OUT THE 3RD AND 5TH ARG
FILTERED_ARGS = $(echo $ARGS | awk '{print $1, $2, $4, $6}')

# PRINT THE COMMAND IPCONFIG, only the ip
echo "IPCONFIG | grep inet | awk '{print $2}'"