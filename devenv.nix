{ pkgs, config, ... }:

{
  # https://devenv.sh/basics/
  env.ADMINER_URL = "127.0.0.1:2023";

  # Enables .env file support
  dotenv.enable = true;
  dotenv.filename = ".env";

  services = {
    # enable mailpit email
    mailpit = { enable = true; };

    # enable redis
    redis = { enable = true; };

    # enable postgresql database
    postgres = {
      enable = false;
      initialDatabases = [{ name = "${config.env.DB_DATABASE}"; }];
      initialScript = ''
        CREATE USER ${config.env.DB_USER} WITH ENCRYPTED PASSWORD '${config.env.DB_PASSWORD}';
        GRANT ALL PRIVILEGES ON DATABASE postgres TO ${config.env.DB_USER};
      '';

    };
  };

  # enable adminer to manage DB things
  services.adminer.enable = true;
  services.adminer.listen = "${config.env.ADMINER_URL}";

  enterShell = ''
    if [[ ! -d node_modules ]]; then
        npm install
    fi
  '';

  # https://devenv.sh/languages/
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs-18_x;
  };

}
