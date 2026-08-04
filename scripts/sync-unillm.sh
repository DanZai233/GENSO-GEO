#!/usr/bin/env bash
# 从 ~/Git/unillm-sdk 同步构建产物到 vendor/unillm-sdk。
# 发布 npm 后可以删除本目录,把 package.json 依赖改为 "unillm-sdk": "^0.1.0"。
set -euo pipefail

SRC="${UNILLM_SRC:-$HOME/Git/unillm-sdk}"
DEST="$(cd "$(dirname "$0")/.." && pwd)/vendor/unillm-sdk"

if [ ! -f "$SRC/package.json" ]; then
  echo "✗ 未找到源包目录: $SRC (可用 UNILLM_SRC 指定)" >&2
  exit 1
fi

echo "→ 构建源包…"
(cd "$SRC" && npm run build >/dev/null)

echo "→ 同步到 $DEST"
rm -rf "$DEST/dist"
cp -R "$SRC/dist" "$DEST/dist"
cp "$SRC/README.md" "$DEST/README.md"
# vendor 里的 package.json 是精简版(不包含 devDependencies),保持不变

echo "✓ 同步完成 (unillm-sdk $(node -p "require('$SRC/package.json').version"))"
