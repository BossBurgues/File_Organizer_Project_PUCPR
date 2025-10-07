import os

# Altere para a pasta que aparece vazia no app
caminho_para_testar = 'C:\\Users\\Gustavo\\OneDrive\\Pictures\\Screenshots' 

print(f"--- Testando o caminho: {caminho_para_testar} ---")

try:
    # Verifica se o caminho realmente existe
    if not os.path.exists(caminho_para_testar):
        print("Resultado: ERRO, o caminho especificado nao existe!")
    elif not os.path.isdir(caminho_para_testar):
        print("Resultado: ERRO, o caminho especificado nao e uma pasta!")
    else:
        conteudo = os.listdir(caminho_para_testar)

        if not conteudo:
            print("Resultado: A pasta esta vazia ou os arquivos nao sao visiveis para este script.")
        else:
            print(f"Encontrados {len(conteudo)} itens:")
            for item in sorted(conteudo):
                print(f"- {item}")

except Exception as e:
    print(f"!!! Ocorreu um erro ao tentar ler a pasta: {e}")

print("\n--- Teste Concluído ---")
