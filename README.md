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

## Développement

L'idée est de faire une approche Lagrangienne du modèle de Lighthill-Whitham-Richards (LWR) cet-à-dire approcher de manière particulaire le flux étudier.

Nous prenons ici l'exemple du trafic routier.

J'ai donc choisi de faire des automates cellulaires pour représenter chaque voiture, ainsi une loi de comportement peut être donnée à chaque automate et un résultat analogue à une description eulérienne devrait émerger.

### Le Modèle LWR

Soit &rho; la densité de voitures, le modèle LWR est défini comme : 

<p style="font-family: times, serif; font-size:13pt; font-style:italic">
&part;<sub>t </sub>&rho;(t, x) + &part;<sub>x</sub>(&rho;v(&rho;)) = 0
</p>




