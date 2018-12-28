export COMPOSER_PROVIDERS='{
    "github": {
        "provider": "github",
        "module": "passport-github",
        "clientID": "386ee0e3e32d2bf76d8c",
        "clientSecret": "9241c12721ce6240fd5e6617efcbb9bcb1758e57",
        "authPath": "/auth/github",
        "callbackURL": "/auth/github/callback",
        "successRedirect": "http://localhost:4200/success",
        "failureRedirect": "http://localhost:4200/error"
    }
}'
composer-rest-server -c admin@agora-network -m true