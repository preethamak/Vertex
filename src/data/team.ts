export type Member = { name: string; role?: string };
export type Team = {
  id: string;
  name: string;
  code: string;
  head: Member;
  members: Member[];
};

export const leadership: Member[] = [
  { name: "Preetham AK", role: "Founder" },
  { name: "Pavan Achar", role: "President" },
  { name: "Madan Kumar", role: "Vice President" },
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
