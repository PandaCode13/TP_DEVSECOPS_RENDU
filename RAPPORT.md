Etape 1 :

Exercice 1 : Lire le Dockerfile 

question 1 : Pourquoi utilise-t-on un multi-stage build plutôt qu'un seul FROM ?

Réponse : On utilise le multi-stage build plutot qu'un seul from car dans notre Dockerfille, on a un premier FROM pour installer tous les dépendances, ensuite on a un deuxième FROM pour construire le projet et enfin on a un troisième FROM pour exécuter le projet. Je pense que le multi-stage est utile pour essayer de réduire la taille de l'image afin de séparer les étapes de construction (dépendances et builder) avec l'étape de l'exécution.

Question 2: Que fait la ligne output: 'standalone' dans next.config.js et comment Docker l'exploite-t-elle ?

Réponse: Je pense que il se peut que ça génère un dossier à part sans dépendre à node_modules. Ensuite on ajoute cette ligne : 
COPY --from=builder /app/.next/standalone ./
Enfin il execute la commande node server.js 

Question 3: Pourquoi crée-t-on un utilisateur nextjs non-root ?

D'après certains articles, tu crées un user nextjs non-root pour éviter qu'il puisse avoir des droits sur ton code. 

Question 4 : À quoi sert HEALTHCHECK dans le Dockerfile ?

Réponse : Elle permet de surveiller l'état de l'application.

Etape 1.2 : 

Commande prévue : 

docker build -t helpdesk:dev .
docker images | grep helpdesk    # Notez la taille de l'image
docker run -d -p 3000:3000 \
  -e JWT_SECRET="$(openssl rand -base64 32)" \
  --name helpdesk-container helpdesk:dev

# Initialiser la DB dans le conteneur
docker exec helpdesk-container npx prisma migrate deploy
docker exec helpdesk-container npx tsx prisma/seed.ts

# Vérifier
curl http://localhost:3000/api/health

Réponse : l'image est crée avec une taille de 300Mo. Le statut est bien ok lorss de l'execution de la commande curl. 

Etape 1.3 : 

TOus les commandes sont executés et voici le résultat de la dernière commande.

![alt text](<Capture d’écran du 2026-05-23 07-42-23.png>)

Etape 2 : Test Unitaires

Etape 2.1 : 

J'ai effectué des executions de ces commandes prévues. voici le resultat : 

pour  la commande npm test, voici la capture

![alt text](image.png)

pour la commande npm run test:coverage (c'est le tableau)

![alt text](image-1.png)

Etape 2.2 : 

Ces tests servent à vérifier que les parties importantes fonctionnent correctement.  
J’ai testé la validation des données pour éviter d’accepter des informations incorrectes, comme un mot de passe vide ou un mauvais statut de ticket.

J’ai aussi ajouté un test pour vérifier qu’un token expiré est refusé, ce qui permet de sécuriser l’authentification.

Enfin, la fonction `canEditTicket` permet de gérer les droits de modification d’un ticket : un admin ou un agent peut modifier les tickets, alors qu’un utilisateur simple peut seulement modifier ses propres tickets.

