$envVars = Get-Content "./config.env"

ForEach ($envVar in $envVars) {
  $key, $val = $envVar.split("=")
  Set-Item "env:$key" $val
}

npm run serve
