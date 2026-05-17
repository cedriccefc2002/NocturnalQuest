#!/bin/bash
for d in */; do
  echo $d
  i=0;
  for f in ./$d*.{jpg,png,webp}; do
    mv "$f" "./$d$((i++)).temp.webp"
  done
  i=0; for f in ./$d*.temp.webp; do mv "$f" "./$d$((i++)).webp"; done
done