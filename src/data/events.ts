export type ClubEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  status: "upcoming" | "past";
  tag: string;
  description: string;
};

export const events: ClubEvent[] = [
  {
    id: "vertex-launch",
    title: "Vertex Launch Night",
    date: "2026-03-14",
    location: "Main Auditorium",
    status: "upcoming",
    tag: "Launch",
    description:
      "The official kickoff of Vertex. Team introductions, keynote from the founders, and the first-ever tech showcase.",
  },
  {
    id: "hack-vertex",
    title: "Hack Vertex 01",
    date: "2026-04-19",
    location: "Tech Block, Level 3",
    status: "upcoming",
    tag: "Hackathon",
    description:
      "24-hour build weekend. Bring an idea, leave with a shipped project. Mentors from every Vertex team on the floor.",
  },
  {
    id: "design-jam",
    title: "Design × Code Jam",
    date: "2026-05-10",
    location: "Studio 2",
    status: "upcoming",
    tag: "Workshop",
    description:
      "Media and Technical teams team up for a live design-to-code jam. Build a real interface in a single afternoon.",
  },
  {
    id: "sponsor-mixer",
    title: "Industry Mixer",
    date: "2026-06-07",
    location: "Rooftop Lounge",
    status: "upcoming",
    tag: "Networking",
    description:
      "Sponsorship team hosts partners, alumni, and recruiters. Members demo projects, share cards, make moves.",
  },
];
