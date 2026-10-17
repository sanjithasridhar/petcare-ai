import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/api-auth";

export async function GET(request: Request) {
  try {
    const user = await currentUser(request);
    const pets = await prisma.pet.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ pets });
  } catch (error) {
    console.error("[pets] failed to load pets", error);
    return NextResponse.json({ error: "Failed to load pets." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser(request);
    const body = await request.json().catch(() => ({}));
    const { name, species, breed, age } = body;
    if (!name || !species) {
      return NextResponse.json({ error: "Name and species are required." }, { status: 400 });
    }

    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed: breed || null,
        age: age ? parseInt(String(age), 10) : null,
        ownerId: user.id,
      },
    });

    return NextResponse.json({ pet }, { status: 201 });
  } catch (error) {
    console.error("[pets] failed to save pet", error);
    return NextResponse.json({ error: "Failed to save pet." }, { status: 500 });
  }
}
