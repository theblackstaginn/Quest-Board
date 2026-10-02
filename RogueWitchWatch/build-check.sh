#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$ROOT_DIR"

if ! command -v xcodebuild >/dev/null 2>&1; then
  echo "xcodebuild is required. Run this on a Mac with Xcode installed." >&2
  exit 1
fi

if ! command -v xcodegen >/dev/null 2>&1; then
  echo "xcodegen 2.46.0+ is required. Install it with: brew install xcodegen" >&2
  exit 1
fi

XCODEGEN_VERSION=$(xcodegen --version | awk '{print $NF}')
echo "Using XcodeGen $XCODEGEN_VERSION"
xcodebuild -version

rm -rf RogueWitchWatch.xcodeproj Generated
xcodegen generate

xcodebuild \
  -project RogueWitchWatch.xcodeproj \
  -scheme RogueWitchWatch \
  -resolvePackageDependencies

xcodebuild \
  -project RogueWitchWatch.xcodeproj \
  -scheme RogueWitchWatch \
  -configuration Debug \
  -sdk watchsimulator \
  -destination 'generic/platform=watchOS Simulator' \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  build

echo "Rogue Witch Watch simulator build passed."
