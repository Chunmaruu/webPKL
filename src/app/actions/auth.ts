"use server";

import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  namaDesa: z
    .string()
    .min(3, { message: "Nama desa minimal 3 karakter" })
    .trim(),
  kecamatan: z
    .string()
    .min(2, { message: "Kecamatan wajib diisi" })
    .trim(),
  kabupaten: z
    .string()
    .min(2, { message: "Kabupaten wajib diisi" })
    .trim(),
  email: z
    .string()
    .email({ message: "Format email tidak valid" })
    .trim(),
  password: z
    .string()
    .min(6, { message: "Password minimal 6 karakter" }),
});

const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Format email tidak valid" })
    .trim(),
  password: z
    .string()
    .min(1, { message: "Password wajib diisi" }),
});

export type AuthState = {
  errors?: Record<string, string[]>;
  message?: string;
} | undefined;

export async function register(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = RegisterSchema.safeParse({
    namaDesa: formData.get("namaDesa"),
    kecamatan: formData.get("kecamatan"),
    kabupaten: formData.get("kabupaten"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { namaDesa, kecamatan, kabupaten, email, password } =
    validatedFields.data;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      message: "Email sudah terdaftar. Silakan login.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      namaDesa,
      kecamatan,
      kabupaten,
      email,
      password: hashedPassword,
      role: "ADMIN_DESA",
    },
  });

  await createSession({
    id: user.id,
    namaDesa: user.namaDesa,
    email: user.email,
    role: user.role,
  });

  redirect("/dashboard");
}

export async function login(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      message: "Email atau password salah.",
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      message: "Email atau password salah.",
    };
  }

  const userRole = user.role || (user.email === "admin@desaweb.id" ? "SUPER_ADMIN" : "ADMIN_DESA");

  await createSession({
    id: user.id,
    namaDesa: user.namaDesa,
    email: user.email,
    role: userRole,
  });

  if (userRole === "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  } else {
    redirect("/dashboard");
  }
}

export async function adminLogin(
  state: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      message: "Email atau password Admin Master salah.",
    };
  }

  // Check role or email fallback
  const isSuperAdmin = user.role === "SUPER_ADMIN" || user.email === "admin@desaweb.id";

  if (!isSuperAdmin) {
    return {
      message: "Akses ditolak. Akun Anda bukan Admin Master.",
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return {
      message: "Email atau password Admin Master salah.",
    };
  }

  await createSession({
    id: user.id,
    namaDesa: user.namaDesa,
    email: user.email,
    role: "SUPER_ADMIN",
  });

  redirect("/admin/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
