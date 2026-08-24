//#region node_modules/.nitro/vite/services/ssr/assets/roles.server-KUZ4Ph49.js
async function loadViewer(supabase, userId) {
	const [rolesRes, memberRes] = await Promise.all([supabase.from("user_roles").select("role").eq("user_id", userId), supabase.from("members").select("id, slug, name, role, team_id, photo_url, bio, skills, links, is_head").eq("user_id", userId).maybeSingle()]);
	const roles = (rolesRes.data ?? []).map((r) => String(r.role));
	const m = memberRes.data;
	return {
		userId,
		roles,
		isAdmin: roles.includes("admin"),
		isHead: roles.includes("head") || Boolean(m?.is_head),
		headTeams: m?.is_head && m.team_id ? [m.team_id] : [],
		member: m ? {
			id: m.id,
			slug: m.slug,
			name: m.name,
			role: m.role,
			teamId: m.team_id,
			photoUrl: m.photo_url,
			bio: m.bio,
			skills: m.skills ?? [],
			links: m.links ?? {}
		} : null
	};
}
async function assertAdmin(supabase, userId) {
	const viewer = await loadViewer(supabase, userId);
	if (!viewer.isAdmin) throw new Error("Admins only.");
	return viewer;
}
async function assertStaff(supabase, userId) {
	const viewer = await loadViewer(supabase, userId);
	if (!viewer.isAdmin && !viewer.isHead) throw new Error("Team heads and admins only.");
	return viewer;
}
//#endregion
export { assertAdmin, assertStaff, loadViewer };
