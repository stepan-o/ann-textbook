"""Backend package bootstrap for local monorepo development.

The FastAPI app depends on educational kernels that live in the shared
`packages/educational-kernels/python` directory. For this early-stage monorepo,
we make that directory importable once at package import time so the rest of the
backend can use normal imports like `from kernels.perceptron import ...`.
"""

from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parents[3]
EDUCATIONAL_KERNELS_ROOT = REPO_ROOT / "packages" / "educational-kernels" / "python"

if EDUCATIONAL_KERNELS_ROOT.is_dir():
    kernels_path = str(EDUCATIONAL_KERNELS_ROOT)
    if kernels_path not in sys.path:
        sys.path.insert(0, kernels_path)
