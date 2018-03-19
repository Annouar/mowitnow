MowItNow
=========

## Project
<pre>
La société MowItNow a décidé de développer une tondeuse à gazon automatique, destinée aux surfaces rectangulaires.

La tondeuse peut être programmée pour parcourir l'intégralité de la surface.
La position de la tondeuse est représentée par une combinaison de coordonnées (x,y) et d'une lettre indiquant l'orientation selon la notation cardinale anglaise (N,E,W,S). La pelouse est divisée en grille pour simplifier la navigation. 

Par exemple, la position de la tondeuse peut être « 0, 0, N », ce qui signifie qu'elle se situe dans le coin inférieur gauche de la pelouse, et orientée vers le Nord.

Pour contrôler la tondeuse, on lui envoie une séquence simple de lettres. Les lettres possibles sont « D », « G » et « A ». « D » et « G » font pivoter la tondeuse de 90° à droite ou à gauche respectivement, sans la déplacer. « A » signifie que l'on avance la tondeuse d'une case dans la direction à laquelle elle fait face, et sans modifier son orientation.

Si la position après mouvement est en dehors de la pelouse, la tondeuse ne bouge pas, conserve son orientation et traite la commande suivante. 

On assume que la case directement au Nord de la position (x, y) a pour coordonnées (x, y+1).

Pour programmer la tondeuse, on lui fournit un fichier d'entrée construit comme suit :
•	La première ligne correspond aux coordonnées du coin supérieur droit de la pelouse, celles du coin inférieur gauche sont supposées être (0,0)
•	La suite du fichier permet de piloter toutes les tondeuses qui ont été déployées. Chaque tondeuse a deux lignes la concernant :
•	la première ligne donne la position initiale de la tondeuse, ainsi que son orientation. La position et l'orientation sont fournies sous la forme de 2 chiffres et une lettre, séparés par un espace
•	la seconde ligne est une série d'instructions ordonnant à la tondeuse d'explorer la pelouse. Les instructions sont une suite de caractères sans espaces.

Chaque tondeuse se déplace de façon séquentielle, ce qui signifie que la seconde tondeuse ne bouge que lorsque la première a exécuté intégralement sa série d'instructions.

Lorsqu'une tondeuse achève une série d'instruction, elle communique sa position et son orientation.

OBJECTIF
Concevoir et écrire un programme s'exécutant sur une JVM ≥ 1.7, un navigateur web ou un serveur node.js, et implémentant la spécification ci-dessus et passant le test ci-après

TEST
Le fichier suivant est fourni en entrée :
5 5
1 2 N
GAGAGAGAA
3 3 E
AADAADADDA

On attend le résultat suivant (position finale des tondeuses) :
1 3 N
5 1 E

NB: Les données en entrée peuvent être injectée sous une autre forme qu'un fichier (par exemple un test automatisé).
</pre>

### Feature
- Allows you to resolve mowItNow from different formats (plain text, array, async and sync file)
- Detect errors such as instructions specs, two mowers on same positions in specs, deadlock (all mowers that still runs are blocked by other mowers), ..

### Requirements
* [Node 9](https://nodejs.org/en/) (It should works with some olders versions)
* A Node Package Manager (I personaly use [yarn](https://yarnpkg.com/en/), [npm](https://www.npmjs.com/), ...)


## The solution
The solution is a library you can import to actualy solve the problem

### Installing
```shell
git clone https://github.com/Annouar/mowitnow.git
cd mowitnow
yarn install
```

### Quick start
```javascript
const { mowItNow } = require('mowitnow');

const path = '/path/to/my/instructions.txt'
const solution = mowItNow().fromFileSync(path)
                           .resolve()
                           .getMowers();
```
You will find a better example in the 'examples' folder or in tests.

### Run the example

```shell
cd path/to/mowitnow/example
node example.js
```

## Tests
You can run both linter & tests by doing :
```shell
npm install
npm test
```

You should get something like:
```
 mowItNow
    √ should export the mowItNow factory helper
    factory create a new MowItNowWorker
      √ should return a MowItNowWorker
      √ should create a new instance per call
    init with helpers functions
      √ should init with plain text and return current instance
      √ should init from array and return current instance
      √ should init from file - async
      √ should init from file - sync
      √ raise Exception if two mowers have been found at the same position
    getMowers()
      √ it should be a MowItNowWorker function
      √ should return an array
      √ should containing current mowers states (position, isStuck)
    resolve()
      √ should resolve a simple case
      √ should resolve a mower trying to go out of zone case
      √ should resolve the project case
      √ should raise an exception if deadlock (mowers blocked by each others)

  Position
    √ should export the class
    create a position instance
      √ should create a Position instance
      √ should include x, y and orientation properties
      √ should include x, y, orientation well-formated instantiatied value
    representation
      √ 'N' should return " ^ "
      √ 'W' should return " < "
      √ 'S' should return " v "
      √ 'E' should return ' > '
      √ Other value should return "   "
    rotations
      N
        √ turnLeft should rotate the position to W
        √ turnRight should rotate the position to E
      W
        √ turnLeft should rotate the position to S
        √ turnRight should rotate the position to N
      S
        √ turnLeft should rotate the position to E
        √ turnRight should rotate the position to W
      E
        √ turnLeft should rotate the position to N
        √ turnRight should rotate the position to S
    future position
      √ should return next position to North
      √ should return next position to West
      √ should return next position to South
      √ should return next position to East


  36 passing (55ms)
```
