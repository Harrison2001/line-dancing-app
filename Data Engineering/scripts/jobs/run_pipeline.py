from pathlib import Path
import subprocess
import sys

BASE_DIR = Path(__file__).resolve().parents[2]

PIPELINE_STEPS = [
    # 1. Collect raw data
    (
        "Collect CopperKnob",
        BASE_DIR / "scripts" / "collect" / "scrape_copperknob_recent.py",
    ),
    (
        "Collect BootStepper",
        BASE_DIR / "scripts" / "collect" / "collect_bootstepper.py",
    ),

    # 2. Clean source files into staging
    (
        "Clean CopperKnob dances",
        BASE_DIR / "scripts" / "clean" / "clean_copperknob.py",
    ),
    (
        "Clean BootStepper dances",
        BASE_DIR / "scripts" / "clean" / "clean_bootstepper.py",
    ),

    # 3. Merge cleaned staging files
    (
        "Merge dance sources",
        BASE_DIR / "scripts" / "merge" / "merge_dance_sources.py",
    ),

    # 4. Validate merged final data
    (
        "Validate final dances",
        BASE_DIR / "scripts" / "validate" / "validate_final_dance.py",
    ),

    # 5. Load final export into MongoDB
    (
        "Load dances",
        BASE_DIR / "scripts" / "load" / "load_dances.py",
    ),
]


def run_step(step_name, script_path):
    print(f"\n{'=' * 50}")
    print(f"RUNNING: {step_name}")
    print(f"{'=' * 50}")

    if not script_path.exists():
        print("SKIPPED: Missing file")
        print(script_path)
        return

    result = subprocess.run(
        [sys.executable, str(script_path)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )

    if result.stdout:
        print(result.stdout)

    if result.stderr:
        print(result.stderr)

    if result.returncode != 0:
        raise RuntimeError(f"Pipeline failed at: {step_name}")

    print(f"COMPLETED: {step_name}")


def run_pipeline():
    print("\nStarting Line Dancing Data Pipeline")

    for step_name, script_path in PIPELINE_STEPS:
        run_step(step_name, script_path)

    print("\nPipeline Complete")


if __name__ == "__main__":
    run_pipeline()