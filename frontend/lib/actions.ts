"use server"

import { revalidatePath } from "next/cache"

export async function createSandbox(body: {
  type: string
  name: string
  userId: string
  visibility: string
}) {
  console.log("creating. body:", body)
  const res = await fetch(
    "https://database.ishaan1013.workers.dev/api/sandbox",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )

  return await res.text()
}

export async function updateSandbox(body: {
  id: string
  name?: string
  visibility?: "public" | "private"
}) {
  await fetch("https://database.ishaan1013.workers.dev/api/sandbox", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  revalidatePath("/dashboard")
}

export async function deleteSandbox(id: string) {
  await fetch(`https://database.ishaan1013.workers.dev/api/sandbox?id=${id}`, {
    method: "DELETE",
  })

  revalidatePath("/dashboard")
}

export async function shareSandbox(sandboxId: string, email: string) {
  const res = await fetch(
    "https://database.ishaan1013.workers.dev/api/sandbox/share",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sandboxId, email }),
    }
  )
  const text = await res.text()

  if (res.status !== 200) {
    return { success: false, message: text }
  }

  revalidatePath(`/code/${sandboxId}`)
  return { success: true, message: "Shared successfully." }
}

export async function unshareSandbox(sandboxId: string, userId: string) {
  await fetch("https://database.ishaan1013.workers.dev/api/sandbox/share", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sandboxId, userId }),
  })

  revalidatePath(`/code/${sandboxId}`)
}
