set -x

size=512
for file in `\find . -name '*.png'`; do
  convert -geometry ${size}x${size} $file $file
done
