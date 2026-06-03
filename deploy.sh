#!/bin/bash
# Azure Kudu deployment script
# Runs automatically when you push to Azure's Git remote

echo "--- Installing server dependencies ---"
cd server && npm install --production && cd ..

echo "--- Installing client dependencies ---"
cd client && npm install && cd ..

echo "--- Building React frontend ---"
cd client && npm run build && cd ..

echo "--- Copying React build to server/public ---"
cp -r client/build/. server/public/

echo "--- Deployment complete ---"
