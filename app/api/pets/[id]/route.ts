import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/api-auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser(request);
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing pet ID" }, { status: 400 });
    }

    await prisma.pet.delete({
      where: { id, ownerId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[pets] failed to delete pet", error);
    return NextResponse.json({ error: "Failed to delete pet." }, { status: 500 });
  }
}
