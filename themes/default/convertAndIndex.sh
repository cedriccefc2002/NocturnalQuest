#!/bin/bash
for d in */; do
  echo $d
  i=0;
  for f in ./$d*.{jpg,png,webp}; do
    convert "$f" "$f.converted.webp" && rm "$f"
  done
  i=0; for f in ./$d*.converted.webp; do mv "$f" "./$d$((i++)).webp"; done
done