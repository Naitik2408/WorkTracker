import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID || 'team_0WpfZCf6a39ejSjBvj7h51SE';

  try {
    const res = await fetch(`https://api.vercel.com/v9/projects?teamId=${teamId}&limit=50`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      next: { revalidate: 30 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from Vercel API: ${res.statusText}`);
    }

    const data = await res.json();
    const projects = (data.projects || []).map((p: any) => {
      const deployments = p.latestDeployments || [];
      const latest = deployments[0] || {};
      const meta = latest.meta || {};

      // Domain or production URL
      const prodTargets = p.targets?.production;
      const primaryDomain = prodTargets?.alias?.[0] || latest.url || `${p.name}.vercel.app`;

      return {
        id: p.id,
        name: p.name,
        framework: p.framework || 'other',
        domain: primaryDomain,
        status: latest.readyState || 'READY',
        branch: meta.githubCommitRef || 'main',
        commitMsg: (meta.githubCommitMessage || 'Initial deployment').split('\n')[0],
        repo: meta.githubCommitRepo || p.link?.repo || p.name,
        repoOwner: meta.githubCommitOrg || 'Naitik2408',
        updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString()
      };
    });

    return NextResponse.json({
      success: true,
      total: projects.length,
      projects
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
