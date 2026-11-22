"""Prepare a cache directory with --cache before running the examples."""

import argparse
from pathlib import Path

parser = argparse.ArgumentParser(description="Prepare the example cache directory.")
parser.add_argument("--cache-dir", required=True, type=Path)
args = parser.parse_args()
args.cache_dir.mkdir(parents=True, exist_ok=True)
print(f"Cache directory ready: {args.cache_dir}")
