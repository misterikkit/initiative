#!/bin/sh

set -x

. $HOME/initiative.env
TARGET="$BACKEND_TARGET"
VERSION="$(git describe --tags --always --dirty)"

cd $(dirname $0)

rsync -az --progress --exclude node_modules --exclude .git . "${TARGET}:initiative-${VERSION}"

ssh $TARGET << EOF
set -x
source .nvm/nvm.sh
cd initiative-${VERSION}
npm install
cd ..
pm2 stop initiative
ln -sfT initiative-${VERSION} initiative
pm2 start initiative
EOF