export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

export NODE_ENV=production
source ~/.bashrc

npm install -g serve
/root/.nvm/versions/node/v20.17.0/bin/serve -s dist -p 5170
