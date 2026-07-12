export type Member = {
  name: string;
  role?: string;
  team?: string;
  teamId?: string;
  photo?: string;
  bio?: string;
  skills?: string[];
  isHead?: boolean;
  isLeadership?: boolean;
};

export type Team = {
  id: string;
  name: string;
  code: string;
  head: Member;
  members: Member[];
};

export const leadership: Member[] = [
  { name: "Preetham AK", role: "Founder", bio: "Founded Vertex in 2026 with the vision of a college technical club built by teams, not titles." },
  { name: "Pavan Achar", role: "President", bio: "Leads Vertex operations, strategy, and the people who make everything move." },
  { name: "Madan Kumar", role: "Vice President", bio: "Backs up leadership, coordinates teams, keeps the club running end-to-end." },
];

export const teams: Team[] = [
  {
    id: "events",
    name: "Event Management",
    code: "EVT",
    head: { name: "Parinitha N" },
    members: [
      { name: "Pawan Kumar" },
      { name: "Sai Brundha" },
      { name: "Raghuveer Singh" },
      { name: "Namratha N. Raju" },
    ],
  },
  {
    id: "media",
    name: "Media",
    code: "MED",
    head: { name: "Rahul NE" },
    members: [
      { name: "Raagib Qadri" },
      { name: "Raghava" },
      { name: "Vedashree R." },
      { name: "Chaithali K. K." },
      { name: "Niveditha" },
    ],
  },
  {
    id: "pr",
    name: "PR & Marketing",
    code: "PRM",
    head: { name: "Nagendra Mahesha" },
    members: [
      { name: "Jeevith" },
      { name: "K. B. Janavi" },
      { name: "Chandana S." },
      { name: "Thanaya S." },
    ],
  },
  {
    id: "tech",
    name: "Technical",
    code: "TCH",
    head: { name: "Akash Gouda" },
    members: [
      { name: "Shivam" },
      { name: "Mohammed Tasowuff" },
      { name: "Shalini M." },
      { name: "Dhruthi C." },
      { name: "Chinmayi K. C." },
    ],
  },
  {
    id: "sponsorship",
    name: "Sponsorship",
    code: "SPN",
    head: { name: "Sindhuja" },
    members: [
      { name: "Rithika" },
      { name: "Navya K." },
      { name: "S. N. Jeevan" },
      { name: "Ashish Jayaprakash" },
    ],
  },
];

export function initials(name: string): string {
  const parts = name.replace(/\./g, "").split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type EnrichedMember = Required<Pick<Member, "name">> & Member & {
  slug: string;
};

export function getAllMembers(): EnrichedMember[] {
  const all: EnrichedMember[] = [];
  leadership.forEach((m) =>
    all.push({ ...m, slug: slugify(m.name), isLeadership: true, team: "Leadership", teamId: "leadership" }),
  );
  teams.forEach((t) => {
    all.push({
      ...t.head,
      slug: slugify(t.head.name),
      role: t.head.role ?? "Team Head",
      team: t.name,
      teamId: t.id,
      isHead: true,
    });
    t.members.forEach((m) =>
      all.push({
        ...m,
        slug: slugify(m.name),
        role: m.role ?? "Member",
        team: t.name,
        teamId: t.id,
      }),
    );
  });
  return all;
}

export function findMember(slug: string): EnrichedMember | undefined {
  return getAllMembers().find((m) => m.slug === slug);
}
