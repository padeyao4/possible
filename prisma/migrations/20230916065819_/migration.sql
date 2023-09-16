-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdTime" DATETIME NOT NULL,
    "offsetX" BIGINT NOT NULL,
    "offsetY" BIGINT NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "dataIndex" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL
);
