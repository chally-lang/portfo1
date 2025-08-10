-- CreateIndex
CREATE INDEX "Conversation_sessionId_idx" ON "public"."Conversation"("sessionId");

-- CreateIndex
CREATE INDEX "Conversation_createdAt_idx" ON "public"."Conversation"("createdAt");
