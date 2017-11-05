npm run build
echo "Compressing..."
tar -zcf dist.tar.gz dist package.json
echo "Sending..."
scp dist.tar.gz kramster:dist/
echo "Running server prod deploy script"
ssh -t kramster './deploy-production.sh'
