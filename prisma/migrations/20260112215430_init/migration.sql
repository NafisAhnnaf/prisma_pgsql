-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StudyLevel" AS ENUM ('SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'SSC', 'O_LEVEL', 'HSC', 'A_LEVEL', 'UNIVERSITY');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('INTRA_CAMPUS', 'INTER_CAMPUS', 'ONLINE');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'ENDED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "first_name" TEXT,
    "avatar" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "birth_date" DATE,
    "roll_number" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Developer" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "approved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_by_id" UUID,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "approved_at" TIMESTAMP(3),
    "approved_by_id" UUID,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "study_level" "StudyLevel" NOT NULL,
    "institution_id" UUID,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "eiin" INTEGER,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "image_url" TEXT,
    "tags" TEXT[],
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "sponsors" TEXT[],
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "admin_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubEvent" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),

    CONSTRAINT "SubEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventParticipant" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "sub_event_id" UUID,
    "participant_id" UUID NOT NULL,
    "registration_status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registered_at" TIMESTAMP,

    CONSTRAINT "EventParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_urls" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Developer_user_id_key" ON "Developer"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_user_id_key" ON "Admin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Member_user_id_key" ON "Member"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_user_id_key" ON "Participant"("user_id");

-- CreateIndex
CREATE INDEX "Participant_institution_id_idx" ON "Participant"("institution_id");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_key" ON "Institution"("name");

-- CreateIndex
CREATE INDEX "Event_starts_at_created_at_idx" ON "Event"("starts_at", "created_at");

-- CreateIndex
CREATE INDEX "SubEvent_event_id_idx" ON "SubEvent"("event_id");

-- CreateIndex
CREATE INDEX "EventParticipant_participant_id_idx" ON "EventParticipant"("participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "EventParticipant_event_id_sub_event_id_participant_id_key" ON "EventParticipant"("event_id", "sub_event_id", "participant_id");

-- CreateIndex
CREATE INDEX "Post_user_id_created_at_idx" ON "Post"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "Comment_post_id_user_id_created_at_idx" ON "Comment"("post_id", "user_id", "created_at");

-- AddForeignKey
ALTER TABLE "Developer" ADD CONSTRAINT "Developer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubEvent" ADD CONSTRAINT "SubEvent_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_sub_event_id_fkey" FOREIGN KEY ("sub_event_id") REFERENCES "SubEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
