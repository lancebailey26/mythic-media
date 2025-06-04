// src/pages/api/generateThumbnails.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas, loadImage, registerFont } from 'canvas';
registerFont('./public/fonts/expressway.ttf', { family: 'Expressway' });
const classColorMap: Record<string, string> = {
    "Death Knight": "#C41F3B",
    "Demon Hunter": "#A330C9",
    "Druid": "#FF7D0A",
    "Evoker": "#33937F",
    "Hunter": "#ABD473",
    "Mage": "#69CCF0",
    "Monk": "#00FF96",
    "Paladin": "#F58CBA",
    "Priest": "#FFFFFF",
    "Rogue": "#FFF569",
    "Shaman": "#0070DE",
    "Warlock": "#9482C9",
    "Warrior": "#C79C6E"
};

async function getBlizzardAccessToken() {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const response = await fetch('https://oauth.battle.net/token', {
        method: 'POST',
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(`${process.env.BLIZZARD_CLIENT_ID}:${process.env.BLIZZARD_CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Token fetch failed: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.access_token;
}

async function getCharacterRenderURL(realmSlug: string, characterName: string, region: string, token: string) {
    const res = await fetch(
        `https://${region}.api.blizzard.com/profile/wow/character/${realmSlug.toLowerCase()}/${characterName.toLowerCase()}/character-media?namespace=profile-${region}&locale=en_US`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Blizzard API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const mainRaw = data.assets?.find((a: { key: string; value: string }) => a.key === 'main-raw');
    if (!mainRaw) throw new Error('main-raw image not found in character media');
    return mainRaw.value;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { name, realm, region = 'us' } = req.body;

    if (!name || !realm) {
        return res.status(400).json({ error: 'Missing character name or realm' });
    }

    try {
        const rioUrl = `https://raider.io/api/v1/characters/profile?region=${region}&realm=${realm}&name=${name}&fields=mythic_plus_recent_runs`;
        const rioRes = await fetch(rioUrl);
        if (!rioRes.ok) throw new Error('Failed to fetch character data');
        const data = await rioRes.json();

        const run = data?.mythic_plus_recent_runs?.[0];
        if (!run) return res.status(404).json({ error: 'No recent runs found' });

        const spec = data.active_spec_name;
        const className = data.class;
        const dungeonName = run.dungeon;
        const mythicLevel = run.mythic_level;
        const backgroundImageUrl = run.background_image_url;

        const bgImg = await loadImage(backgroundImageUrl);
        const token = await getBlizzardAccessToken();
        const renderUrl = await getCharacterRenderURL(realm, name, region, token);
        const charImg = await loadImage(renderUrl);

        const canvas = createCanvas(1280, 720);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0, 1280, 720);
        const zoom = 1.6;
        const scaledWidth = charImg.width * zoom;
        const scaledHeight = charImg.height * zoom;

        const destX = -250; // Anchor to left edge of canvas
        const destY = (720 - scaledHeight) / 2;

        ctx.drawImage(charImg, destX, destY, scaledWidth, scaledHeight);

        const textX = 550;
        const startY = (720 - 292) / 2;

        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        ctx.font = 'bold 100px "Expressway"';
        ctx.lineWidth = 10;
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;

        // Create gradient fill for key level text
        const gradient = ctx.createLinearGradient(textX - 100, startY, textX + 100, startY + 100);
        gradient.addColorStop(0, '#00FFFF'); // Cyan
        gradient.addColorStop(1, '#FF00FF'); // Magenta

        ctx.fillStyle = gradient;
        ctx.strokeText(`+${mythicLevel}`, textX, startY);
        ctx.fillText(`+${mythicLevel}`, textX, startY);


        ctx.font = 'bold 80px "Expressway"';
        ctx.fillStyle = '#FFD700';
        ctx.strokeText(dungeonName.toUpperCase(), textX, startY + 100 + 20);
        ctx.fillText(dungeonName.toUpperCase(), textX, startY + 100 + 20);

        ctx.font = 'bold 72px "Expressway"';
        ctx.fillStyle = classColorMap[className] || '#FFFFFF';
        ctx.strokeText(`${spec.toUpperCase()} ${className.toUpperCase()}`, textX, startY + 100 + 20 + 80 + 20);
        ctx.fillText(`${spec.toUpperCase()} ${className.toUpperCase()}`, textX, startY + 100 + 20 + 80 + 20);




        const buffer = canvas.toBuffer('image/png');
        res.status(200).json([{ imageBase64: buffer.toString('base64') }]);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
}
