-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(50) NOT NULL,
    "first_name" CHAR(50),
    "last_name" CHAR(50),
    "email" VARCHAR(100),
    "password" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
