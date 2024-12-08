#! /bin/bash

JS_PATH=/home/zzc/acapp/game/static/js/
JS_PATH_DIST=${JS_PATH}dist/
JS_PATH_SRC=${JS_PATH}src/


find $JS_PATH_SRC -type f -name '*.js' | sort | xargs cat > ${JS_PATH_DIST}game.js

# django 打包static
echo yes | python3 ../manage.py collectstatic


