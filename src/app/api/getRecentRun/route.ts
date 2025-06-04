// src/pages/api/getRecentRun.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { region = 'us', realm, name } = req.query;

  if (!realm || !name) {
    return res.status(400).json({ error: 'Missing realm or name' });
  }

  try {
    const url = `https://raider.io/api/v1/characters/profile?region=${region}&realm=${realm}&name=${name}&fields=mythic_plus_recent_runs`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch from Raider.IO');

    const data = await response.json();

    const recentRun = data?.mythic_plus_recent_runs?.[0];
    if (!recentRun) return res.status(404).json({ error: 'No recent runs found' });

    res.status(200).json({
      characterName: data.name,
      class: data.class,
      spec: data.active_spec_name,
      race: data.race,
      gender: data.gender,
      faction: data.faction,
      characterImage: data.thumbnail_url,
      run: recentRun
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
