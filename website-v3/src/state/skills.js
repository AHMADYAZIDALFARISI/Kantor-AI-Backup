// Klasifikasi skill → ruangan memakai public/data/room-categories.json (aturan transparan, hasil = estimasi).
export function classifySkills(skills, rules) {
  const byRoom = {}, unmatched = [];
  for (const id of rules.order) byRoom[id] = [];
  for (const s of skills) {
    const text = ` ${s.name} ${s.desc || ''}`.toLowerCase();
    let room = null;
    for (const id of rules.order) {
      const r = rules.rooms[id];
      if (r.repos?.includes(s.repo)) { room = id; break; }
      if (s.kind === 'agent' && r.agentCats?.includes(s.cat)) { room = id; break; }
    }
    if (!room) for (const id of rules.order) {
      if ((rules.rooms[id].keywords || []).some(k => text.includes(k))) { room = id; break; }
    }
    (room ? byRoom[room] : unmatched).push(s);
  }
  return { byRoom, unmatched, total: skills.length };
}
