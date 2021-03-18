# Simple Traffic Simulator

Une simulation de traffic simple en [p5.js](https://p5js.org/) créée dans le cadre du cours de Calcul Scientifique en Application de Nicolas Seguin en M2 CSM à l'Université de Rennes 1.

## Lancer la simulation

Pour tester le programme, télécharger le projet et ouvrir le fichier *index.html* avec un navigateur.

Autrement, j'ai une version en ligne disponible [ici](https://csa-m2-csm.herokuapp.com/) (peut prendre un peu de temps a charger le temps que le serveur se lance).

## Commandes 

| Commande | Effet |
| -------- | ----- |
| Click sur une voiture | Sélectionne la voiture pour être contrôlée |
| Spacebar | Stoppe la voiture sélectionnée (frein à main) |
| Flèches directionnelles | Fais accélérer/décélérer la voiture sélectionnée |

# Développement

L'idée est de faire une approche Lagrangienne du modèle de Lighthill-Whitham-Richards (LWR) cet-à-dire approcher de manière particulaire le flux étudier. Pour cela on utilise les connexions entre le modèle LWR et le modèle Follow-The-Leader (FTL).

Nous prenons ici l'exemple du trafic routier.

J'ai donc choisi de faire des automates cellulaires pour représenter chaque voiture, ainsi une loi de comportement peut être donnée à chaque automate et un résultat analogue à une description eulérienne devrait émerger.

## Le Modèle LWR

Soit *&rho;* la densité de voitures et *&rho;<sub>max</sub>* la densité maximale de voitures.

Soit *v* la vitesse de la voiture et *v<sub>max</sub>* la vitesse maximale de la voiture, on suppose que la vitesse de la voiture dépend seulement de la densité locale et est non décroissante telle que *v*(0) = *v<sub>max</sub>* et *v*(*&rho;<sub>max</sub>*) = 0

Le modèle LWR est tel que : 

*&part;<sub>t</sub>&rho;*(*t*, *x*) + *&part;<sub>x</sub>*(*&rho;v*(*&rho;*)) = 0

avec la condition initiale : 

*&rho;*(0, t) = *&rho;<sub>0</sub>*(*x*)

et *&rho;<sub>0</sub>* la densité initiale de voitures.

On peut déjà commencer à sentir que *v* peut prendre la forme d'une fonction inverse si on pose par exemple *v*(*&rho;*) = 1/*&rho;*.

## Le Modèle FTL

Dans le modèle Follow-The-Leader, une voiture, la première de la file, est désignée *leader*. Sa vitesse est *v<sub>max</sub>*.

On a donc :

*v<sub>Leader</sub>*(t) = *&rho;<sub>max</sub>*

Comme la vitesse *v* est fonction de la densité locale, on la calcule avec la masse *m* de la voiture et la distance à la voiture suivante :

*v*<sub>i</sub>(t) = *v*( *m*/*d*<sub>i</sub>(t) ) 

avec 

*d*<sub>i</sub>(t) = *x*<sub>i+1</sub>(t) - *x*<sub>i</sub>(t)

## Discrétisation temporelle

Le programme tourne dans un environnement [p5.js](https://p5js.org/) où nous allons utiliser la fonction *draw* pour itérer sur les instants consécutifs. Cette fonction se comporte comme la boucle principale et s'éxécute en boucle afin de faire tourner le programme. Le &#916;t est donc implicite comme les calculs s'effectueront pas à pas.

Les valeurs d'accélération, vitesse et positions sont discrétisées ainsi :

*v*<sub>i</sub>(*n*+1) = *v*<sub>i</sub>(*n*) + *a*<sub>i</sub>(*n*+1)

*x*<sub>i</sub>(*n*+1) = *x*<sub>i</sub>(*n*) + *v*<sub>i</sub>(*n*+1)

avec *v* = *x&#775;* et *a* = *x&#776;*

## Structure

L'idée initiale d'utiliser des automates cellulaires m'a conduit à imaginer une simulation où un nombre fini de voitures se déplacent sur une route et sont indexées dans un tableau. A chaque tour de boucle le programme itère sur le tableau pour mettre à jour les voitures et faire ainsi passer un &#916;t. Quand une voiture arrive à la fin de la zone de rendu de la simulation, elle est renvoyée au début afin de "boucler".

Cependant cette idée posait deux problèmes majeurs :

* Les voitures dans le tableau ne sont pas toujours dans l'ordre de la file sur la route.

* Cela devient difficile de gérer les conditions limites à cause de la boucle.

Une version de cette approche peut être trouvée [ici](https://github.com/Tdxasie/Simple-Traffic-Simuator-prototype).

Ces problèmes sont tout à fait réglables mais j'ai eu une idée qui me plaisait beaucoup mieux : __simuler un trafic infini sur une portion de route avec un flux constant de nouvelles voitures arrivant à gauche__. Ainsi les voitures peuvent simplement être suprimmées quand elles sortent de la portion de route. Le tableau qui indexe les voitures est donc une liste de type FIFO (First In First Out).

De plus j'ai donné plus d'autonomie aux voitures en leur déléguant la tache de s'indexer et se suprimmer du tableau. Ainsi la boucle principale ne fait que créer des nouvelles voitures quand l'interval avec la dernière voiture créée est cohérent avec la vitesse et la distance de sécurité.

## Accélération

Le modèle donne une manière de calculer la vitesse à chaque instant, cependant, implémenté tel quel, en cas d'arrêt forcé, les voitures subissent une accélération infinie en passant de *v* = 0 à *v* = *v<sub>target</sub>* ou inversement ce qui n'est pas physique.

Chaque voiture accélère donc linéairement pour arriver à cette vitesse. Ce qui rend le modèle beaucoup plus réaliste.

# Résultats 

Avec le flux infini de voitures, lorsqu'on clique sur une voiture et qu'on l'arrête pendant un instant avant de la laisser continuer, on observe bien des ondes de ralentissement qui se propagent dans le sens inverse du sens de circulation des voitures, c'est le fameux *effet accordéon*.

# Programmation

Utiliser la programmation orientée objet pour représenter l'automate cellulaire me parait plus naturel dans le sens où même à l'échelle de la programmation, les conducteurs sont des entités à part entière n'ayant qu'une perception limitée de leur entourage et du phénomène mis en évidence. 
### L'automate Cellulaire 

Pour programmer un modèle avec des automates cellulaires, j'ai créé une classe *__Car__* qui représente une *voiture* et contient les méthodes et propriétés propres au conducteur et à son comportement.

Voici une liste des propriétés et donc des données auxquelles ont accès chaque voiture :

| Propriété | Type | Description | Utilité |
| --------- | ---- |----------- | ------- |
| `acc`     | `p5.Vector` | Vecteur accélération | Est ajouté au vecteur vitesse à tous les tours puis remis a zéro. |
| `vel`     | `p5.Vector` | Vecteur vitesse | Est ajouté au vecteur position à tous les tours. |
| `pos`     | `p5.Vector` | Vecteur position | Calcul de la distance à la prochaine voiture. |
| `color` | `p5.Color` | Couleur de la voiture | Mise en évidence de la voiture lors d'un click. |
| `mass` | `int` | Masse | Calcul de la densité locale. |
| `dist` | `float` | Distance à la prochaie voiture | Calcul de la densité locale. |
| `nextCar` | `Car` | Référence à la prochaine voiturre | Calcul de `dist` et propagation de l'exécution du programme. |
| `carsArray` | `Car[]` | Tableau du scope global contenant la liste FIFO des voitures. | Chaque voiture a la liberté de s'y ajouter ou d'en enlever la `nextCar` au moment opportun. |
| `prevCar` | `Car` | Référence à la voiture précédente | Non utilisée mais pourrait être utile pour une loi de comportement plus raffinnée (rétroviseur). |
| `isSelected` | `bool` | Flag de sélection | Identification de la voiture sélectionnée par l'utilisateur. | 
| `isLeader` | `bool` | Flag de leader | Permet à la voiture de se comporter comme le leader |


Voici une liste des méthodes principales de la classe :

| Méthode | Arguments | Utilité |
| ------- | --------- | ------- |
| `constructor(_nextCar, x, _mass, _cars)` | `(Car)nextCar` : référence à la voiture précédente. `(int)x` : position initiale. `(int)mass : masse`. `(Car)[]`: tableau de référencement des voitures | Initialise toutes les propriétés |
| `run()` | Aucun |Exécute une mise à jour de l'objet en éxécutant de manière séquentielle les méthodes `drive()`, `control()`, `update()`, `edgeCheck()`, `render()`. Propage également sa propre éxécution chez la voiture suivante. |
| `drive()` |  Aucun | Contient la loi de commande de la voiture : calcul de la vitesse target puis gestion de l'accélération automatique. |
| `control()`| Aucun | Gère l'input utilisateur sur l'accélération et le frein à main |
| `update()` | Aucun | Effectue le calcul de la vitesse, gère le freinage brutal |
| `edgeCheck()` | Aucun | Empêche les voiture de se dépasser et gère la supression de la voiture suivante lorsqu'on est en dehors de la zone de rendu de la simulation |
| `render()` | Aucun | Rendu graphique de la voiture (dessin du rectangle, etc) |
| `clicked()` | Aucun | Les voitures ne peuvent pas détecter les clicks, cette fonction est trigger par le scope global et chaque voiture propage son exécution à la suivante, permettant ainsi de détecter la voiture sur laquelle à eu le clic | `tellNextCar()` | Aucun | Permet à la voiture de s'identifier auprès de la voiture suivante |
| `setPrevCar(car)` | `(Car)car` une référence à l'objet voiture précédent | Enregistre la référence dans les propriétés |

## Comportement "Autonome"

Comme on peut le voir dans la boucle principale, seule une voiture est mise à jour et on ne s'occupe pas de remplir le tableau des voitures. J'ai programmé les voitures pour qu'elles propagent : 

* la mise à jour 
* la détection des clics

Chaque voiture prend la responsabilité de suprimmer sa `nextCar` du tableau quand elle est hors de la zone de rendu depuis trop longtemps et assume automatiquement le rôle de leader jusqu'à ce que la voiture précédente fasse la même chose.

Chaque voiture s'auto ajoute au début du tableau lors de la création et s'identifie auprès de sa `nextCar`.

Les voitures ont donc accès à toutes les données nécessaires à des modèles plus raffinés.

Le tableau de voiture contient donc toujours en moyenne le même nombre de voitures, ordonnées dans le même ordre qu'à l'affichage.
# Améliorations

Il manque une visualisation de la densité locale de voitures car c'est assez difficile de déceler les ralentissements qui se propagent à l'oeil nu.

J'ai du mal à voir l'effet de la masse, peut être que les ordres de gradeurs ne sont pas bons.

Des sliders pour les autres paramètres pourraient être ajoutés.




# Références

[1] N. Seguin. *Time Discretized Lagrangian approach of the Lighthill-Whitham-Richards model using a Follow-The-Leader scheme*. Unpublished.
