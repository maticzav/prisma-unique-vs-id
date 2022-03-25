-- CreateTable
CREATE TABLE "UniqueAB" (
    "id" TEXT NOT NULL,
    "a" TEXT NOT NULL,
    "b" TEXT NOT NULL,

    CONSTRAINT "UniqueAB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IDAB" (
    "a" TEXT NOT NULL,
    "b" TEXT NOT NULL,

    CONSTRAINT "IDAB_pkey" PRIMARY KEY ("a","b")
);

-- CreateIndex
CREATE UNIQUE INDEX "UniqueAB_a_b_key" ON "UniqueAB"("a", "b");
