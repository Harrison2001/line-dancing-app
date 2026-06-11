from pathlib import Path
import subprocess
import sys

BASE_DIR = Path(__file__).resolve().parents[2]

PIPELINE_STEPS = [
    ("Clean dances", BASE_DIR / "scripts" / "clean" / "clean_dances.py"),
    ("Validate dances", BASE_DIR / "scripts" / "validate" / "validate_final_dance.py"),
    ("Merge dance sources", BASE_DIR / "scripts" / "merge" / "merge_dance_sources.py"),
    ("Load dances", BASE_DIR / "scripts" / "load" / "load_dances.py"),
]


def run_step(step_name, script_path):
    print(f"\n=== Running: {step_name} ===")

    if not script_path.exists():
        print(f"Skipped. Missing file: {script_path}")
        return

    result = subprocess.run(
        [sys.executable, str(script_path)],
        capture_output=True,
        text=True,
    )

    print(result.stdout)

    if result.stderr:
        print(result.stderr)

    if result.returncode != 0:
        raise RuntimeError(f"Pipeline failed at: {step_name}")


def run_pipeline():
    print("Starting line dancing data pipeline...")

    for step_name, script_path in PIPELINE_STEPS:
        run_step(step_name, script_path)

    print("\nPipeline complete.")


if __name__ == "__main__":
    run_pipeline()