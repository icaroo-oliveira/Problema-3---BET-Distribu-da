# Passo 1: Compilar o projeto Hardhat
Write-Host "Compilando o projeto Hardhat..."
npx hardhat compile

# Passo 2: Iniciar o nó Hardhat em um novo terminal
Write-Host "Iniciando o nó Hardhat..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx hardhat node"

# Aguardar o nó ser inicializado (ajuste o tempo se necessário)
Start-Sleep -Seconds 15

# Passo 3: Executar o deploy
Write-Host "Executando deploy..."
$tempFile = [System.IO.Path]::GetTempFileName()

# Executa o comando em uma nova janela do PowerShell, redirecionando a saída para o arquivo temporário
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npx hardhat ignition deploy ./ignition/modules/evento.js --network localhost | Out-File -FilePath $tempFile" -Wait

# Aguardar o processo terminar e ler o arquivo de saída
Start-Sleep -Seconds 5

# Lê a saída do arquivo temporário
$deployOutput = Get-Content -Path $tempFile

# Exibe a saída do deploy
Write-Host $deployOutput

# Captura o endereço do contrato diretamente da saída
$address = $deployOutput | Select-String -Pattern "eventoModule#evento - (0x[a-fA-F0-9]{40})" | ForEach-Object { $_.Matches.Groups[1].Value }

# Salva o endereço no arquivo
if ($address) {
    Write-Host "Endereço do contrato: $address"
    $address | Out-File -FilePath "contrato_endereco.txt"
    Write-Host "Endereço salvo em contrato_endereco.txt"
} else {
    Write-Host "Falha ao capturar o endereço do contrato."
}
