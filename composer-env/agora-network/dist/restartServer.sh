docker kill rest
docker rm rest
export COMPOSER_CARD="restadmin@agora-network"
export COMPOSER_NAMESPACES="never"
export COMPOSER_MULTIUSER="true"
export COMPOSER_PROVIDERS='{
    "github": {
        "provider": "github",
        "module": "passport-github",
        "clientID": "386ee0e3e32d2bf76d8c",
        "clientSecret": "9241c12721ce6240fd5e6617efcbb9bcb1758e57",
        "authPath": "/auth/github",
        "callbackURL": "/auth/github/callback",
        "successRedirect": "http://20.0.0.99:4200/success",
        "failureRedirect": "http://20.0.0.99:4200/error"
    }
}'
export COMPOSER_DATASOURCES='{
    "db": {
        "name": "db",
        "connector": "mongodb",
        "host":"mongo"
        }
    }'

echo $COMPOSER_PROVIDERS

docker run \
-d \
-e COMPOSER_CARD=${COMPOSER_CARD} \
-e COMPOSER_NAMESPACES=${COMPOSER_NAMESPACES} \
-e COMPOSER_AUTHENTICATION=${COMPOSER_AUTHENTICATION} \
-e COMPOSER_MULTIUSER=${COMPOSER_MULTIUSER} \
-e COMPOSER_PROVIDERS="${COMPOSER_PROVIDERS}" \
-e COMPOSER_DATASOURCES="${COMPOSER_DATASOURCES}" \
-v ~/.composer:/home/composer/.composer \
--name rest \
--network composer_default \
-p 3000:3000 \
es2812/agorachain:latest

docker logs rest -f