# Simple Traffic Simulator

Un prototype de simulation de traffic simple dans le cadre du cours de Calcul Scientifique en Application de Nicolas Seguin en M2 CSM à l'Université de Rennes 1.

## Lancer la simulation

Pour tester le programme, il suffit d'ouvrir le fichier *index.html* avec un navigateur.

Autrement, j'ai une version en ligne disponible [ici](https://csa-m2-csm.herokuapp.com/).

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

et *&rho;<sub>0</sub>* la densité initiale de voitures. x&#776; x&#775;

On peut déjà commencer à sentir que *v* peut prendre la forme d'une fonction inverse si on pose par exemple *v*(*&rho;*) = 1/*&rho;*.

## Le Modèle FTL

Dans le modèle Follow-The-Leader, une voiture, la première de la file, est désignée *leader*. Sa vitesse est *v<sub>max</sub>*.

On a donc :

*v<sub>Leader</sub>*(t) = *&rho;<sub>max</sub>*

Comme la vitesse *v* est fonction de la densité locale, on la calcule avec la masse *m* de la voiture et la distance à la voiture suivante :

*v*<sub>i</sub>(t) = *v*( *m*/*d*<sub>i</sub>(t) ) avec *d*<sub>i</sub>(t) = *x*<sub>i+1</sub>(t) - *x*<sub>i</sub>(t)

# Programmation

Utiliser la programmation orientée objet pour représenter l'automate cellulaire me parait plus naturel dans le sens où même à l'échelle de la programmation, les conducteurs sont des entités à part entière n'ayant qu'une perception limitée de leur entourage et du phénomène mis en évidence. 

### L'automate Cellulaire 

Pour programmer un modèle avec des automates cellulaires, j'ai créé une classe *__Car__* qui représente une *voiture* et contiendra les méthodes et propriétés propres au conducteur et à son comportement.




J'ai d'abord commencé par faire un premier essai avec des voitures spécifiquement créées et répertoriées dans un tableau. A chaque tour de boucle les voitures étaient appelées individuellement pour être mises à jour.

