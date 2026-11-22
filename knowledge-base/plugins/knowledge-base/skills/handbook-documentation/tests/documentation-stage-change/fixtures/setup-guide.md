# Prepare the example cache

Run the tool from this directory using Python 3. Choose a writable cache
directory; the tool creates it if it does not exist and reports the selected
path. It does not download data or contact an external service.

```sh
python3 cache_tool.py --cache ./example-cache
```

Use `--cache` to choose another directory. Check for the confirmation message
before running examples that depend on the directory.
