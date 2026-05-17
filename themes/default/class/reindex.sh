#!/bin/bash
for d in */; do
  echo $d
  i=0;
  for f in ./$d*.{jpg,png,webp}; do
    mv "$f" "./$d$((i++)).temp.webp"
  done
  for f in ./$d*.temp.webp; do
    convert "$f" -resize 395x564 "$f.resize.webp" && rm "$f"
  done
  i=0; for f in ./$d*.resize.webp; do mv "$f" "./$d$((i++)).webp"; done
done