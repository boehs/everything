#!/usr/bin/env sh

cd ./lib/ || exit

for dir in */; do
    cd "$dir"

    echo "Publishing directory $dir..."

    if npm publish --access public; then
        echo "Successfully published $dir!"
    else
        echo "Oh no! Failed to publish $dir!"
    fi

    cd ..
done
