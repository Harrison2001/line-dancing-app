from pathlib import Path
import subprocess
import sys

BASE_DIR = Path(__file__).resolve().parents[2]

PIPELINE_STEPS = [
    (
        "Collect CopperKnob",
        BASE_DIR / "scripts" / "collect" / "collect_copperknob_recent.py",
    ),
    (
        "Collect BootStepper",
        BASE_DIR / "scripts" / "collect" / "collect_bootstepper.py",
    ),
    (
        "Clean CopperKnob dances",
        BASE_DIR / "scripts" / "clean" / "clean_copperknob.py",
    ),
    (
        "Clean BootStepper dances",
        BASE_DIR / "scripts" / "clean" / "clean_bootstepper.py",
    ),
    (
        "Merge dance sources",
        BASE_DIR / "scripts" / "merge" / "merge_dance_sources.py",
    ),
    (
        "Validate final dances",
        BASE_DIR / "scripts" / "validate" / "validate_final_dance.py",
    ),
    (
        "Link same-song versions",
        BASE_DIR / "scripts" / "link" / "link_same_song_versions.py",
    ),
    (
        "Enrich YouTube videos",
        BASE_DIR / "scripts" / "enrich" / "enrich_youtube.py",
    ),
    (
        "Load dances",
        BASE_DIR / "scripts" / "load" / "load_dances.py",
    ),
]


def safe_print_output(text):
    if not text:
        return
    encoding = getattr(sys.stdout, "encoding", None) or "utf-8"
    safe_text = text.encode(encoding, errors="replace").decode(encoding, errors="replace")
    print(safe_text)


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
        safe_print_output(result.stdout)

    if result.stderr:
        safe_print_output(result.stderr)

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
