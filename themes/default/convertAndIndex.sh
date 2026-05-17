#!/bin/bash
for d in */; do
  echo $d
  i=0;
  for f in ./$d*.{jpg,png,webp}; do
    convert "$f" "$f.webp.converted" && rm "$f"
  done
  i=0; for f in ./$d*.webp.converted; do mv "$f" "./$d$((i++)).webp"; done
done