import { z } from "zod";

export const memberInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  role: z.string().trim().min(2).max(80),
  teamId: z.string().trim().max(40).nullable(),
  isHead: z.boolean(),
  isLeadership: z.boolean(),
  photoUrl: z.string().trim().max(1000).nullable(),
  bio: z.string().trim().max(2000).nullable(),
  skills: z.array(z.string().trim().min(1).max(40)).max(20),
  links: z.record(z.string(), z.string().trim().max(300)),
  sortOrder: z.number().int().min(0).max(999),
});

export const memberSelfInput = z.object({
  bio: z.string().trim().max(2000).nullable(),
  skills: z.array(z.string().trim().min(1).max(40)).max(20),
  links: z.record(z.string(), z.string().trim().max(300)),
  photoUrl: z.string().trim().max(1000).nullable(),
});

export const eventInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  title: z.string().trim().min(2).max(140),
  eventDate: z.string().trim().min(4).max(20),
  startTime: z.string().trim().max(40).nullable(),
  location: z.string().trim().min(1).max(140),
  tag: z.string().trim().min(1).max(40),
  description: z.string().trim().max(2000).nullable(),
  coverUrl: z.string().trim().max(1000).nullable(),
  capacity: z.number().int().min(0).max(100000).nullable(),
  published: z.boolean(),
});

export const projectInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  title: z.string().trim().min(2).max(140),
  description: z.string().trim().max(2000).nullable(),
  tech: z.array(z.string().trim().min(1).max(40)).max(20),
  coverUrl: z.string().trim().max(1000).nullable(),
  link: z.string().trim().max(500).nullable(),
  year: z.number().int().min(2000).max(2100).nullable(),
  published: z.boolean(),
  contributorIds: z.array(z.string().uuid()).max(50),
});

export const announcementInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(160),
  body: z.string().trim().min(2).max(5000),
  teamId: z.string().trim().max(40).nullable(),
  pinned: z.boolean(),
  published: z.boolean(),
});

export const badgeAwardInput = z.object({
  memberId: z.string().uuid(),
  badgeId: z.string().trim().min(1).max(60),
  note: z.string().trim().max(200).nullable(),
});

export const mentorRequestInput = z.object({
  mentorId: z.string().uuid(),
  topic: z.string().trim().min(3).max(120),
  message: z.string().trim().max(1000).nullable(),
});

export type MemberInput = z.infer<typeof memberInput>;
export type EventInput = z.infer<typeof eventInput>;
export type ProjectInput = z.infer<typeof projectInput>;
export type AnnouncementInput = z.infer<typeof announcementInput>;
