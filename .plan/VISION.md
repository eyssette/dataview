# Dataview

Dataview est un site web qui permet de visualiser des données provenant de fichiers csv, tsv ou Markdown.

Il permet d'afficher les données sous forme d'un tableau, avec différentes fonctionnalités :
- tri de chacune des colonnes (tri ascendant/descendant alterné)
- filtrage des données d'après un formulaire de recherche (recherche par défaut sur toutes les colonnes, possibilité d'utiliser des expressions régulières ou une syntaxe de recherche simplifiée)
- surlignage des termes recherchés dans les résultats

On peut spécifier le format des données et les options de l'interface de visualisation soit via un formulaire sur la page d'accueil, soit via des paramètres dans l'URL (paramètres qui eux-mêmes se modifient dynamiquement en fonction des actions de l'utilisateur).

IMPORTANT : Dataview doit être ultra optimisé et afficher très rapidement les données et permettre un tri et un filtrage le plus proche de l'instantané, même pour de très grandes quantités de données.

## Fonctionnement général

### Cas 1 : il n'y a pas de hash dans l'URL

S'il n'y a pas de hash dans l'URL, Dataview demande à l'utilisateur de remplir un formulaire pour choisir le fichier à visualiser (csv, tsv ou Markdown) à partir de son URL, et choisir les options de l'interface de visualisation.

Une fois le formulaire soumis, Dataview récupère le fichier, détecte le format (csv, tsv ou Markdown) et affiche les données avec les options de l'interface de visualisation choisies par l'utilisateur. L'URL est alors mise à jour avec un hash correspondant à l'URL du fichier et aux options choisies.

### Cas 2 : il y a un hash dans l'URL

S'il y a un hash dans l'URL, ce hash correspond à l'URL du fichier à visualiser. Dataview récupère le fichier, détecte le format (csv, tsv ou Markdown) et affiche les données avec les options choisies et définies dans l'URL (ou les options par défaut si elles ne sont pas spécifiées dans l'URL).

## Fonctionnalités détaillées

### Formats de données supportés
- Fichiers CSV (valeurs séparées par des virgules, ou par un autre délimiteur spécifié)
- Fichiers TSV (valeurs séparées par des tabulations)
- Fichiers Markdown avec structure hiérarchique :
  - Conversion automatique en format CSV pour le traitement
  - Les titres de niveau 2 à 6 deviennent des colonnes hiérarchiques
  - Les éléments de liste (- ou *) sont convertis en lignes de données
  - Les éléments numérotés (1., 2., etc.) sont également pris en compte
  - Les titres des colonnes peuvent être définis via une ligne "Titres :" ou "Titles :" à la fin du document, avec chaque titre séparé par un pipe (|)


### Interface utilisateur si aucun hash n'est présent dans l'URL

#### Apparence générale de la page d'accueil
- Titre "Dataview"
- Sous-titre "Visualisez facilement vos données en ligne"
- Formulaire d'entrée pour entrer l'URL du fichier à visualiser
- Footer avec :
	- "Outil créé par [Cédric Eyssette](https://eyssette.forge.apps.education.fr), sous licence libre"
	- "[Code source](https://forge.apps.education.fr/dataview/dataview.forge.apps.education.Fr) - [Proposer une amélioration ou signaler un bug](https://forge.apps.education.fr/dataview/dataview.forge.apps.education.Fr/issues)"

#### Comportement
- Au moment de la validation de l'URL, récupération des données du fichier (en gérant les types d'URL pour pouvoir correctement récupérer les données), puis détection automatique du format du fichier (csv, tsv ou Markdown), puis affichage de 3 éléments :
	1. À gauche (ou au milieu sur petit écran) : Un extrait des 3 premières lignes du fichier avec le format détecté si on a détecté un format reconnu puis un message indiquant que l'utilisateur peut changer le format si nécessaire (ou un message indiquant que le format n'est pas reconnu et doit être spécifié par l'utilisateur), avec un bouton "Spécifier le format des données" pour afficher le formulaire (caché par défaut) de paramétrage de la source de données
	2. À gauche et en dessous (ou au milieu sur petit écran et en dessous) : le formulaire de paramétrage des options de l'interface de visualisation
	3. À droite (ou au milieu sur petit écran, et en dessous) : une prévisualisation automatique de l'apparence du tableau avec les options choisies par l'utilisateur 

#### Formulaire de paramétrage de la source de données
- On peut choisir le format du fichier (csv, tsv ou Markdown)
- On peut choisir l'encodage du fichier (par défaut : UTF-8)
- On peut spécifier le délimiteur de champ 
- Par défaut, la première ligne du fichier est considérée comme la ligne d'en-tête (titres des colonnes). L'utilisateur peut indiquer que le fichier n'a pas de ligne d'en-tête, auquel cas un champ sera affiché pour saisir les titres de colonnes personnalisés (séparés par un pipe "|")
- On peut choisir de ne pas afficher certaines colonnes (par défaut, toutes les colonnes sont affichées), et on peut choisir de différencier l'affichage des colonnes sur un petit écran (avec un réglage spécifique pour les colonnes à afficher sur un petit écran)
- On peut réorganiser l'ordre d'affichage des colonnes (par défaut, les colonnes sont affichées dans l'ordre du fichier), et on peut choisir un ordre d'affichage des colonnes différent sur un petit écran
- On peut choisir d'avoir un tri par défaut lors de l'affichage initial du tableau (par défaut, le tableau n'est pas trié)
- On peut choisir pour chaque colonne une formule de transformation des données, sous la forme d'une expression régulière de match et d'une expression régulière de remplacement  (par exemple : pour transformer une date au format "2024-01-01" en "01/01/2024", on peut utiliser la formule de transformation suivante : match : "(\d{4})-(\d{2})-(\d{2})" et replace : "$3/$2/$1")

#### Formulaire de paramétrage des options de l'interface de visualisation
- On peut choisir d'afficher ou non le titre de la page et changer ce titre (par défaut : "Dataview")
- On peut choisir d'afficher ou non un descriptif sous le titre et changer ce descriptif (par défaut, il s'agit des explications sur le fonctionnement de l'interface de tri et de filtrage des données)
- On peut choisir l'autorisation ou non de l'affichage automatique et immédiat des résultats lors de la saisie dans le champ de recherche ou si l'utilisateur doit valider sa recherche par un bouton ou par "Entrée" (par défaut, l'affichage automatique est activé)
- On peut choisir si la recherche doit être sensible à la casse ou non (par défaut, la recherche n'est pas sensible à la casse) et si elle doit être sensible aux caractères accentués ou non (par défaut, la recherche n'est pas sensible aux caractères accentués)
- On peut choisir l'autorisation ou non de la recherche par des expressions régulières (par défaut, la recherche par expressions régulières est autorisée)
- On peut choisir un texte par défaut dans le champ de recherche (par défaut, le champ de recherche est vide) qui déclenche automatiquement le filtrage des données à l'affichage de la page, avec la possibilité d'avoir un texte de recherche par défaut différent pour un petit écran
- On peut choisir de changer les caractères qui définissent les opérateurs de base "ET" et "OU" dans la syntaxe de recherche simplifiée (par défaut, l'opérateur "ET" est représenté par un caractère "+" et l'opérateur "OU" est représenté par un pipe "|")
- On peut choisir d'afficher ou non un bouton pour copier le lien vers la page de l'interface de visualisation (avec le hash correspondant à l'URL du fichier) avec les informations dans l'URL pour retrouver les mêmes options de l'interface de visualisation et les mêmes options de filtrage et de tri (si l'utilisateur a effectué un filtrage ou un tri des données)
- On peut choisir d'afficher par défaut toutes les données, ou seulement les données filtrées par le texte de recherche par défaut (si celui-ci est défini), ou seulement un texte d'information (qui s'enlève automatiquement si l'utilisateur effectue une recherche, et se réaffiche si l'utilisateur supprime le texte de recherche)
- On peut choisir d'afficher une colonne en plus avec un score de pertinence basé sur le filtrage effectué par l'utilisateur (score calculé en fonction du nombre de correspondances avec les termes recherchés)
- On peut spécifier des filtres additionnels qui s'afficheront en dessous du champ de recherche principal et permettront de filtrer les résultats selon des critères supplémentaires (exemple : filtrer sur une colonne spécifique, filtrer sur une valeur spécifique, filtrer sur une plage de valeurs, etc.)
	- on a "ajouter un filtre" pour ajouter un nouveau filtre
	- si on a cliqué sur "ajouter un filtre", on a un formulaire pour choisir la colonne à filtrer (ou toutes), le type de filtrage (contient, ne contient pas, commence par, se termine par, égal à, différent de, supérieur à, inférieur à, entre deux valeurs, regex, etc.) et la valeur à filtrer (ou les deux valeurs pour un filtrage entre deux valeurs)
	- un bouton pour supprimer un filtre est affiché à côté de chaque filtre ajouté
	- la possibilité de déplacer les filtres pour changer l'ordre d'affichage des filtres en dessous du champ de recherche principal
- On peut changer la taille par défaut de chaque colonne (et différencier la taille par défaut des colonnes sur un petit écran)
- On peut choisir entre plusieurs thèmes d'affichage
- On peut ajouter du CSS personnalisé pour modifier l'apparence de l'interface de visualisation


### Interface utilisateur si un hash est présent dans l'URL

L'affichage est configurable via l'interface de départ qui s'affiche si aucun hash n'est présent dans l'URL, et est définie par les paramètres dans l'URL. 

Par défaut, on affiche :

- le titre de la page
- le descriptif sous le titre
- le formulaire de recherche avec le texte par défaut dans le champ de recherche (par défaut, le champ de recherche est vide)
- les filtres additionnels (s'il y en a : par défaut, il n'y en a pas)
- à droite (ou en dessous sur un petit écran) : le bouton pour copier le lien vers la page de l'interface de visualisation avec les informations dans l'URL pour retrouver les mêmes options de l'interface de visualisation et les mêmes options de filtrage et de tri (si l'utilisateur a effectué un filtrage ou un tri des données)
- le tableau avec les titres de colonnes cliquables pour trier les données (par défaut, le tableau n'est pas trié)
- les résultats de la recherche et du tri sont affichés (par défaut, l'affichage automatique est activé et immédiat)