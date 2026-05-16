#!/bin/bash
for d in */; do
  echo $d
  i=0;
  for f in ./$d*.{jpg,png,webp}; do
    mv "$f" "./$d$((i++)).temp.jpg"
  done
  for f in ./$d*.temp.jpg; do
    convert "$f" -resize 395x564 "$f.resize.jpg" && rm "$f"
  done
  i=0; for f in ./$d*.resize.jpg; do mv "$f" "./$d$((i++)).jpg"; done
done