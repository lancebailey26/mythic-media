import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const region = searchParams.get('region') || 'us';
  const realm = searchParams.get('realm');
  const name = searchParams.get('name');

  if (!realm || !name) {
    return NextResponse.json({ error: 'Missing realm or name' }, { status: 400 });
  }

  try {
    const url = `https://raider.io/api/v1/characters/profile?region=${region}&realm=${realm}&name=${name}&fields=mythic_plus_recent_runs`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch from Raider.IO');

    const data = await response.json();

    const recentRun = data?.mythic_plus_recent_runs?.[0];
    if (!recentRun) {
      return NextResponse.json({ error: 'No recent runs found' }, { status: 404 });
    }

    return NextResponse.json({
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
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
