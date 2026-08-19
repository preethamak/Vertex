update public.events set published = false
where slug in ('vertex-launch','hack-vertex','design-jam','sponsor-mixer');

update public.event_workspaces w
set registration_open = true, min_team_size = 2, max_team_size = 6
from public.events e
where e.id = w.event_id and e.slug = 'sih-internal-hackathon';

update public.members
set photo_path = split_part(substring(photo_url from '/object/sign/media/(.*)$'), '?', 1)
where photo_url like '%/object/sign/media/%' and photo_path is null;

update public.members
set photo_url = '/api/public/media/' || photo_path
where photo_path is not null;

update public.projects
set cover_path = split_part(substring(cover_url from '/object/sign/media/(.*)$'), '?', 1)
where cover_url like '%/object/sign/media/%' and cover_path is null;

update public.projects
set cover_url = '/api/public/media/' || cover_path
where cover_path is not null;