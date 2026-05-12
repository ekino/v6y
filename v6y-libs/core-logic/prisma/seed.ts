import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../.env') });

import { getPrismaClient } from '../src/database/PrismaClient.ts';
import bcrypt from 'bcrypt';

const prisma = getPrismaClient();

async function main() {
    console.log('[Seed] Starting seed...');

    if (!process.env.SUPERADMIN_PASSWORD) {
        throw new Error('SUPERADMIN_PASSWORD env variable is required to run seed');
    }

    // ─── Reference data ───────────────────────────────────────────────────────

    await prisma.evolutionHelp.upsert({
        where: { category: 'Lighthouse-seo' },
        update: {},
        create: { category: 'Lighthouse-seo', title: 'SEO', description: 'Search Engine Optimisation score', status: 'important' },
    });
    await prisma.evolutionHelp.upsert({
        where: { category: 'Lighthouse-accessibility' },
        update: {},
        create: { category: 'Lighthouse-accessibility', title: 'Accessibility', description: 'Accessibility score', status: 'critical' },
    });
    await prisma.evolutionHelp.upsert({
        where: { category: 'Lighthouse-performance' },
        update: {},
        create: { category: 'Lighthouse-performance', title: 'Performance', description: 'Overall performance score', status: 'critical' },
    });

    await prisma.auditHelp.upsert({
        where: { category: 'Lighthouse-seo' },
        update: {},
        create: { category: 'Lighthouse-seo', title: 'SEO Audit', description: 'Search Engine Optimisation audit' },
    });
    await prisma.auditHelp.upsert({
        where: { category: 'Lighthouse-accessibility' },
        update: {},
        create: { category: 'Lighthouse-accessibility', title: 'Accessibility Audit', description: 'Accessibility audit' },
    });
    await prisma.auditHelp.upsert({
        where: { category: 'Lighthouse-performance' },
        update: {},
        create: { category: 'Lighthouse-performance', title: 'Performance Audit', description: 'Performance audit' },
    });

    await prisma.dependencyStatusHelp.upsert({
        where: { category: 'outdated' },
        update: {},
        create: { category: 'outdated', title: 'Outdated', description: 'Dependency is outdated and a newer version exists.' },
    });
    await prisma.dependencyStatusHelp.upsert({
        where: { category: 'deprecated' },
        update: {},
        create: { category: 'deprecated', title: 'Deprecated', description: 'Dependency is deprecated and should be replaced.' },
    });
    await prisma.dependencyStatusHelp.upsert({
        where: { category: 'up-to-date' },
        update: {},
        create: { category: 'up-to-date', title: 'Up to date', description: 'Dependency is up to date.' },
    });

    // ─── FAQ & Notifications ──────────────────────────────────────────────────

    await prisma.faq.upsert({
        where: { title: 'What is v6y?' },
        update: {},
        create: {
            title: 'What is v6y?',
            description: 'v6y (Vitality) is a platform that analyses front-end application health and tracks technical debt.',
            links: [{ label: 'GitHub', value: 'https://github.com/ekino/v6y', description: '' }],
        },
    });

    await prisma.notification.upsert({
        where: { title: 'Welcome to v6y' },
        update: {},
        create: {
            title: 'Welcome to v6y',
            description: 'Welcome to the Vitality platform. Start by adding your first application.',
        },
    });

    // ─── Deprecated dependencies ──────────────────────────────────────────────

    await prisma.deprecatedDependency.upsert({
        where: { name: 'moment' },
        update: {},
        create: { name: 'moment' },
    });
    await prisma.deprecatedDependency.upsert({
        where: { name: 'request' },
        update: {},
        create: { name: 'request' },
    });
    await prisma.deprecatedDependency.upsert({
        where: { name: 'lodash.merge' },
        update: {},
        create: { name: 'lodash.merge' },
    });

    // ─── Accounts ─────────────────────────────────────────────────────────────

    const superadminUsername = process.env.SUPERADMIN_USERNAME || 'superadmin';
    const superadminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@v6y.dev';
    const superadminPassword = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);
    const adminPassword = await bcrypt.hash('admin1234', 10);
    const userPassword = await bcrypt.hash('user1234', 10);

    // ─── Applications (created first so IDs are available for accounts) ───────

    const app1 = await prisma.application.upsert({
        where: { name: 'v6y Front' },
        update: {},
        create: {
            name: 'v6y Front',
            acronym: 'V6Y-FRONT',
            contactMail: 'team@v6y.dev',
            description: 'The main user-facing front-end application of the v6y platform.',
            repo: { gitUrl: 'git@github.com:ekino/v6y.git', webUrl: 'https://github.com/ekino/v6y', organization: 'ekino' },
            links: [
                { label: 'Production', value: 'https://v6y.dev', description: '' },
                { label: 'GitHub', value: 'https://github.com/ekino/v6y', description: '' },
            ],
        },
    });

    const app2 = await prisma.application.upsert({
        where: { name: 'MyZE Battery' },
        update: {},
        create: {
            name: 'MyZE Battery',
            acronym: 'MFS-MYZE',
            contactMail: 'team@ekino.com',
            description: 'MyZE Battery application for Renault.',
            repo: {
                gitUrl: 'git@gitlab.ekino.com:renault/mfs/myze-battery.git',
                webUrl: 'https://gitlab.ekino.com/renault/mfs/myze-battery',
                organization: 'renault',
            },
            links: [
                { label: 'GitLab', value: 'https://gitlab.ekino.com/renault/mfs/myze-battery', description: '' },
            ],
        },
    });

    console.log('[Seed] Applications created:', { app1: app1.id, app2: app2.id });

    const superAdmin = await prisma.account.upsert({
        where: { email: superadminEmail },
        update: {},
        create: {
            username: superadminUsername,
            email: superadminEmail,
            password: superadminPassword,
            role: 'SUPERADMIN',
            applications: [],
        },
    });

    const admin = await prisma.account.upsert({
        where: { email: 'admin@v6y.dev' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@v6y.dev',
            password: adminPassword,
            role: 'ADMIN',
            applications: [],
        },
    });

    const user = await prisma.account.upsert({
        where: { email: 'user@v6y.dev' },
        update: {},
        create: {
            username: 'user',
            email: 'user@v6y.dev',
            password: userPassword,
            role: 'USER',
            applications: [app1.id, app2.id],
        },
    });

    console.log('[Seed] Accounts created:', { superAdmin: superAdmin.id, admin: admin.id, user: user.id });

    // ─── Keywords ─────────────────────────────────────────────────────────────

    await prisma.keyword.createMany({
        data: [
            { appId: app1.id, label: 'React', module: { appId: app1.id, branch: 'main', path: 'package.json', url: 'https://github.com/ekino/v6y' } },
            { appId: app1.id, label: 'Next.js', module: { appId: app1.id, branch: 'main', path: 'package.json', url: 'https://github.com/ekino/v6y' } },
            { appId: app1.id, label: 'TypeScript', module: { appId: app1.id, branch: 'main', path: 'package.json', url: 'https://github.com/ekino/v6y' } },
            { appId: app2.id, label: 'React Native', module: { appId: app2.id, branch: 'main', path: 'package.json', url: 'https://gitlab.ekino.com/renault/mfs/myze-battery' } },
            { appId: app2.id, label: 'TypeScript', module: { appId: app2.id, branch: 'main', path: 'package.json', url: 'https://gitlab.ekino.com/renault/mfs/myze-battery' } },
        ],
        skipDuplicates: true,
    });

    // ─── Dependencies ─────────────────────────────────────────────────────────

    await prisma.dependency.createMany({
        data: [
            { appId: app1.id, type: 'npm', name: 'react', version: '18.2.0', recommendedVersion: '18.3.0', status: 'outdated', module: { appId: app1.id, branch: 'main', path: 'package.json', url: 'https://github.com/ekino/v6y' } },
            { appId: app1.id, type: 'npm', name: 'next', version: '14.0.0', recommendedVersion: '15.0.0', status: 'outdated', module: { appId: app1.id, branch: 'main', path: 'package.json', url: 'https://github.com/ekino/v6y' } },
            { appId: app1.id, type: 'npm', name: 'lodash', version: '4.17.21', recommendedVersion: '4.17.21', status: 'up-to-date', module: { appId: app1.id, branch: 'main', path: 'package.json', url: 'https://github.com/ekino/v6y' } },
            { appId: app1.id, type: 'npm', name: 'moment', version: '2.29.4', recommendedVersion: null, status: 'deprecated', module: { appId: app1.id, branch: 'main', path: 'package.json', url: 'https://github.com/ekino/v6y' } },
            { appId: app2.id, type: 'npm', name: 'react-native', version: '0.73.0', recommendedVersion: '0.74.0', status: 'outdated', module: { appId: app2.id, branch: 'main', path: 'package.json', url: 'https://gitlab.ekino.com/renault/mfs/myze-battery' } },
        ],
        skipDuplicates: true,
    });

    // ─── Evolutions ───────────────────────────────────────────────────────────

    await prisma.evolution.createMany({
        data: [
            { appId: app1.id, category: 'Lighthouse-performance', module: { appId: app1.id, branch: 'main', path: '/', url: 'https://v6y.dev' } },
            { appId: app1.id, category: 'Lighthouse-accessibility', module: { appId: app1.id, branch: 'main', path: '/', url: 'https://v6y.dev' } },
            { appId: app2.id, category: 'Lighthouse-seo', module: { appId: app2.id, branch: 'main', path: '/', url: 'https://gitlab.ekino.com/renault/mfs/myze-battery' } },
        ],
        skipDuplicates: true,
    });

    // ─── Audits ───────────────────────────────────────────────────────────────

    await prisma.audit.createMany({
        data: [
            { appId: app1.id, type: 'Lighthouse', category: 'performance', auditStatus: 'success', score: 78, scoreStatus: 'warning', scoreUnit: 'score', dateStart: new Date('2025-01-01'), dateEnd: new Date('2025-01-01'), module: { appId: app1.id, branch: 'main', path: '/', url: 'https://v6y.dev' } },
            { appId: app1.id, type: 'Lighthouse', category: 'accessibility', auditStatus: 'success', score: 95, scoreStatus: 'success', scoreUnit: 'score', dateStart: new Date('2025-01-01'), dateEnd: new Date('2025-01-01'), module: { appId: app1.id, branch: 'main', path: '/', url: 'https://v6y.dev' } },
            { appId: app1.id, type: 'Lighthouse', category: 'seo', auditStatus: 'success', score: 100, scoreStatus: 'success', scoreUnit: 'score', dateStart: new Date('2025-01-01'), dateEnd: new Date('2025-01-01'), module: { appId: app1.id, branch: 'main', path: '/', url: 'https://v6y.dev' } },
            { appId: app2.id, type: 'Lighthouse', category: 'performance', auditStatus: 'success', score: 88, scoreStatus: 'success', scoreUnit: 'score', dateStart: new Date('2025-01-01'), dateEnd: new Date('2025-01-01'), module: { appId: app2.id, branch: 'main', path: '/', url: 'https://gitlab.ekino.com/renault/mfs/myze-battery' } },
        ],
        skipDuplicates: true,
    });

    console.log('[Seed] Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error('[Seed] Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
