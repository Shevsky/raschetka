-- CreateEnum
CREATE TYPE "CheckStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "ExternalAccountProvider" AS ENUM ('TELEGRAM', 'VK');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('SEE_CHECKS', 'CREATE_CHECKS', 'SEE_USERS', 'EDIT_USERS');

-- CreateTable
CREATE TABLE "Check" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionAt" TIMESTAMP(3) NOT NULL,
    "fiscalDocumentNumber" TEXT NOT NULL,
    "fiscalDriveNumber" TEXT NOT NULL,
    "fiscalSign" TEXT NOT NULL,
    "kktRegId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" "CheckStatus" NOT NULL DEFAULT 'DRAFT',
    "parentChecksCount" INTEGER NOT NULL DEFAULT 1,
    "groupId" TEXT,
    "title" TEXT NOT NULL DEFAULT '',
    "comment" TEXT NOT NULL DEFAULT '',
    "companyName" TEXT NOT NULL DEFAULT '',
    "companyTaxCode" TEXT NOT NULL DEFAULT '',
    "retailPlaceName" TEXT NOT NULL DEFAULT '',
    "retailPlaceAddress" TEXT NOT NULL DEFAULT '',
    "tipsSum" INTEGER NOT NULL DEFAULT 0,
    "itemsSum" INTEGER NOT NULL,
    "totalSum" INTEGER NOT NULL,

    CONSTRAINT "Check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckSentCommunication" (
    "checkId" TEXT NOT NULL,
    "provider" "ExternalAccountProvider" NOT NULL,
    "messageId" TEXT NOT NULL,
    "chatId" TEXT
);

-- CreateTable
CREATE TABLE "CheckGroup" (
    "id" TEXT NOT NULL,

    CONSTRAINT "CheckGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkId" TEXT NOT NULL,
    "filled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CheckParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckItem" (
    "id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "sum" INTEGER NOT NULL,
    "checkId" TEXT NOT NULL,
    "groupId" TEXT,
    "participantId" TEXT,

    CONSTRAINT "CheckItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckItemGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "checkId" TEXT,

    CONSTRAINT "CheckItemGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmojiLookup" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmojiLookup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalAccount" (
    "provider" "ExternalAccountProvider" NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "login" TEXT,
    "firstName" TEXT,
    "secondName" TEXT,
    "lastName" TEXT,
    "userpic" TEXT,

    CONSTRAINT "ExternalAccount_pkey" PRIMARY KEY ("provider","providerId")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("fromUserId","toUserId")
);

-- CreateTable
CREATE TABLE "QueuedMessage" (
    "id" SERIAL NOT NULL,
    "recipientId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "provider" "ExternalAccountProvider",
    "messageId" TEXT,
    "chatId" TEXT,
    "shouldSendAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "QueuedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permissions" "Permission"[],
    "mention" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gender" "Gender",
    "inviterId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CheckItemGroupToCheckParticipant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CheckItemGroupToCheckParticipant_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Check_userId_fiscalDocumentNumber_fiscalDriveNumber_fiscalS_key" ON "Check"("userId", "fiscalDocumentNumber", "fiscalDriveNumber", "fiscalSign", "kktRegId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckSentCommunication_checkId_key" ON "CheckSentCommunication"("checkId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckParticipant_userId_checkId_key" ON "CheckParticipant"("userId", "checkId");

-- CreateIndex
CREATE UNIQUE INDEX "EmojiLookup_query_key" ON "EmojiLookup"("query");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalAccount_userId_provider_key" ON "ExternalAccount"("userId", "provider");

-- CreateIndex
CREATE INDEX "_CheckItemGroupToCheckParticipant_B_index" ON "_CheckItemGroupToCheckParticipant"("B");

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CheckGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckSentCommunication" ADD CONSTRAINT "CheckSentCommunication_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckParticipant" ADD CONSTRAINT "CheckParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckParticipant" ADD CONSTRAINT "CheckParticipant_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckItem" ADD CONSTRAINT "CheckItem_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckItem" ADD CONSTRAINT "CheckItem_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "CheckItemGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckItem" ADD CONSTRAINT "CheckItem_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "CheckParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckItemGroup" ADD CONSTRAINT "CheckItemGroup_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalAccount" ADD CONSTRAINT "ExternalAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueuedMessage" ADD CONSTRAINT "QueuedMessage_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CheckItemGroupToCheckParticipant" ADD CONSTRAINT "_CheckItemGroupToCheckParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "CheckItemGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CheckItemGroupToCheckParticipant" ADD CONSTRAINT "_CheckItemGroupToCheckParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "CheckParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
