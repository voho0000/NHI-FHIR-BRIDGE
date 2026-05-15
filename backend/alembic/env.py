"""Alembic environment — uses our SQLAlchemy Base + DATABASE_URL from app.core.config."""
from __future__ import annotations

import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# Ensure `app.*` imports work regardless of where alembic is invoked from.
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Import after sys.path setup so the models are registered with Base.metadata.
from app.core.config import settings  # noqa: E402
from app.core.database import Base  # noqa: E402
from app.models import fhir_store  # noqa: E402,F401  (registers tables on Base)

config = context.config

# Override the placeholder URL with the runtime setting. Alembic ships
# with a sync engine; convert SQLAlchemy 2.0 async URL → sync.
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite+aiosqlite"):
    db_url = db_url.replace("sqlite+aiosqlite", "sqlite", 1)
elif "+asyncpg" in db_url:
    db_url = db_url.replace("+asyncpg", "+psycopg2", 1)
config.set_main_option("sqlalchemy.url", db_url)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode — emits SQL to stdout."""
    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode against a real DB connection."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
