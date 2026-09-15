# Essência Entre Mentes

Site institucional da clínica Essência Entre Mentes, em Rondonópolis, Mato Grosso.

## Publicação na Vercel

1. Importe este repositório em [vercel.com/new](https://vercel.com/new).
2. Selecione **Other** como framework, caso a Vercel solicite essa escolha.
3. Mantenha a raiz do repositório como **Root Directory**.
4. Publique. O `vercel.json` já define o comando de build e o diretório `dist`.

O build usa `VERCEL_PROJECT_PRODUCTION_URL`, fornecido pela Vercel, para atualizar automaticamente a URL canônica, o sitemap e as imagens de compartilhamento. Para forçar outro domínio, configure a variável `SITE_URL` com a URL completa.

## Desenvolvimento local

Os arquivos públicos estão em `dist/`. Para visualizar localmente, use qualquer servidor HTTP estático apontado para esse diretório.
