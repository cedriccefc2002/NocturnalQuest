#!/bin/bash
for d in */; do
  echo $d
  mkdir -p ./out/$d
  i=0;
  for f in ./$d*.mp4; do
    echo $f
    # ffmpeg -i $f -vf "scale=360:-1,fps=12" -c:v libwebp_anim -loop 0 -compression_level 6 -quality 70 -an ./out/$f.webp
    ffmpeg -i $f ./out/$d$((i++)).webp
  done
done