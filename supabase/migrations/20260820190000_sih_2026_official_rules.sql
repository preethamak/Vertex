-- Source: SIH 2026 Guidelines, Ministry of Education's Innovation Cell, 29 July 2026.
UPDATE public.event_workspaces workspace
SET min_team_size = 6,
    max_team_size = 6,
    rules = E'Official SIH 2026 requirements\n\n1. Each team has exactly 6 student members, including the team leader.\n2. All students in a team must be from the same college; inter-college teams are not permitted.\n3. Each team must include at least one female student member.\n4. Team names must be unique and must not include the institute name.\n5. Only teams selected through this internal hackathon can be nominated by the College SPOC to SIH.\n6. A team may submit ideas against a maximum of 2 problem statements on the SIH portal.\n7. Team leaders must verify the roster, contact details, selected problem statement, idea title, idea description, and Idea Presentation PDF on the official SIH portal.\n8. Shortlisted teams may include up to 2 industry or academic mentors in addition to the 6 student members.\n\nSource: SIH 2026 Guidelines, Ministry of Education\'s Innovation Cell (29 July 2026).',
    updated_at = now()
FROM public.events event
WHERE workspace.event_id = event.id
  AND event.slug = 'sih-internal-hackathon';
