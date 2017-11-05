npm run build
echo "Compressing..."
tar -zcf stage.tar.gz dist package.json
echo "Sending..."
scp stage.tar.gz kramster:stage/
echo "Running server staging deploy script"
ssh -t kramster './deploy-staging.sh'
