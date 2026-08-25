# My portfolio
## Pages par intention

Les cinq pages de service (`creation-site-internet-nantes.html`, etc.), les
quatre etudes de cas (`realisation-splaze.html`, etc.) et le `sitemap.xml` sont
generes par un gabarit unique. Deux tableaux dans `tools/build-pages.mjs`
portent le contenu : `SERVICES` pour les offres, `CASES` pour les realisations.
Modifiez le script, jamais les fichiers HTML generes, puis relancez :

```
node tools/build-pages.mjs
```

Le resultat est commite : Vercel ne fait que servir des fichiers statiques.
