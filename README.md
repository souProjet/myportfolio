# My portfolio
## Pages par intention

Les cinq pages de service (`creation-site-internet-nantes.html`, etc.) et le
`sitemap.xml` sont generes par un gabarit unique. Modifiez le contenu dans
`tools/build-pages.mjs`, jamais les fichiers HTML generes, puis relancez :

```
node tools/build-pages.mjs
```

Le resultat est commite : Vercel ne fait que servir des fichiers statiques.
