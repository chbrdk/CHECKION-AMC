'use client';

import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Box, CircularProgress, alpha, useMediaQuery, useTheme } from '@mui/material';
import { MsqdxTypography, MsqdxButton, MsqdxMoleculeCard, MsqdxChip, MsqdxAccordion, MsqdxAccordionItem, MsqdxTooltip, MsqdxTabs } from '@msqdx/react';
import { MSQDX_SPACING, MSQDX_BRAND_PRIMARY, MSQDX_STATUS, MSQDX_NEUTRAL, MSQDX_THEME } from '@msqdx/tokens';
import { useI18n } from '@/components/i18n/I18nProvider';
import {
    apiScanGeoEeat,
    apiScanGeoEeatRerunCompetitive,
    apiScanGeoEeatCompetitiveHistory,
    apiScanGeoEeatCompetitiveRun,
    PATH_SCAN,
} from '@/lib/constants';
import { CompetitivePositionDiagram } from '@/components/CompetitivePositionDiagram';
import { GeoEeatCompetitiveMetricRow } from '@/components/geo-eeat/GeoEeatCompetitiveMetricRow';
import { GeoEeatPageToolbar } from '@/components/geo-eeat/GeoEeatPageToolbar';
import { GeoEeatSectionJumpNav } from '@/components/geo-eeat/GeoEeatSectionJumpNav';
import type { GeoEeatIntensiveResult, GeoEeatPageResult, CompetitiveBenchmarkResult } from '@/lib/types';
import { amcMobileFlushCardSx, amcMobileFlushPageShellSx } from '@/lib/amc-page-shell';
import { buildCompetitiveRunOptions, competitiveRunIndexFromSelection } from '@/lib/geo-eeat/competitive-run-options';
import { GeoEeatCollapsibleChips } from '@/components/geo-eeat/GeoEeatCollapsibleChips';
import { GeoEeatCompetitiveModelSelector } from '@/components/geo-eeat/GeoEeatCompetitiveModelSelector';
import { GeoEeatCompetitiveRunSelector } from '@/components/geo-eeat/GeoEeatCompetitiveRunSelector';
import { GeoEeatMobileActionBar } from '@/components/geo-eeat/GeoEeatMobileActionBar';
import { GeoEeatQueryCitationList } from '@/components/geo-eeat/GeoEeatQueryCitationList';
import { GeoEeatReasoningDisclosure } from '@/components/geo-eeat/GeoEeatReasoningDisclosure';

const POLL_INTERVAL_MS = 2500;

interface CompetitiveHistoryRun {
    id: string;
    started_at: string;
    completed_at: string | null;
    status: string;
    queryCount: number;
    competitorCount: number;
    modelCount?: number;
}

export default function GeoEeatResultPage() {
    const params = useParams();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { t } = useI18n();
    const theme = useTheme();
    const compact = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
    const rawJobId = params?.jobId;
    const jobId = typeof rawJobId === 'string' ? rawJobId : Array.isArray(rawJobId) ? rawJobId[0] : undefined;

    const [status, setStatus] = useState<'loading' | 'running' | 'complete' | 'error'>('loading');
    const [payload, setPayload] = useState<GeoEeatIntensiveResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [url, setUrl] = useState<string>('');
    const [projectId, setProjectId] = useState<string | null>(null);
    const [competitiveModelIndex, setCompetitiveModelIndex] = useState(0);
    const [rerunLoading, setRerunLoading] = useState(false);
    const [competitiveHistory, setCompetitiveHistory] = useState<CompetitiveHistoryRun[]>([]);
    const [selectedCompetitiveRunId, setSelectedCompetitiveRunId] = useState<string | null>(null);
    const [historyCompetitiveByModel, setHistoryCompetitiveByModel] = useState<Record<string, CompetitiveBenchmarkResult> | null>(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const focusCompetitiveScrolled = useRef(false);

    useEffect(() => {
        focusCompetitiveScrolled.current = false;
    }, [jobId]);

    useEffect(() => {
        if (!jobId) return;
        const id = jobId;

        let cancelled = false;
        let intervalId: ReturnType<typeof setInterval> | null = null;

        async function fetchRun() {
            try {
                const res = await fetch(apiScanGeoEeat(id));
                if (!res.ok) {
                    if (!cancelled) {
                        if (res.status === 404) setError(t('geoEeat.runNotFound'));
                        else setError(t('geoEeat.failedToLoadRun'));
                        setStatus('error');
                    }
                    return;
                }
                const data = await res.json();
                if (cancelled) return;
                setUrl(data.url ?? '');
                if (data.projectId !== undefined) setProjectId(data.projectId ?? null);
                const nextStatus = data.status === 'queued' ? 'running' : data.status;
                setStatus(nextStatus);
                if (data.payload) setPayload(data.payload);
                if (data.error) setError(data.error);
                if (nextStatus === 'complete' || nextStatus === 'error') {
                    if (intervalId) clearInterval(intervalId);
                }
            } catch {
                if (!cancelled) {
                    setError(t('geoEeat.networkError'));
                    setStatus('error');
                    if (intervalId) clearInterval(intervalId);
                }
            }
        }

        fetchRun();
        intervalId = setInterval(fetchRun, POLL_INTERVAL_MS);

        return () => {
            cancelled = true;
            if (intervalId) clearInterval(intervalId);
        };
    }, [jobId, t]);

    const sourceByModel =
        selectedCompetitiveRunId != null ? historyCompetitiveByModel : payload?.competitiveByModel;
    const hasMultiModelFromSource = sourceByModel && Object.keys(sourceByModel).length > 0;
    const competitiveModelsFromSource = hasMultiModelFromSource ? Object.keys(sourceByModel!) : [];

    useEffect(() => {
        if (hasMultiModelFromSource && competitiveModelsFromSource.length > 0 && competitiveModelIndex >= competitiveModelsFromSource.length) {
            setCompetitiveModelIndex(competitiveModelsFromSource.length - 1);
        }
    }, [hasMultiModelFromSource, competitiveModelsFromSource.length, competitiveModelIndex]);

    const hasAnyCompetitiveForScroll =
        Boolean(payload?.competitive?.metrics?.length) || Boolean(hasMultiModelFromSource);

    useEffect(() => {
        if (searchParams.get('focus') !== 'competitive') return;
        if (status !== 'complete') return;
        if (!hasAnyCompetitiveForScroll) return;
        if (focusCompetitiveScrolled.current) return;
        const el = document.getElementById('geo-eeat-competitive');
        if (!el) return;
        focusCompetitiveScrolled.current = true;
        requestAnimationFrame(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (pathname) window.history.replaceState(null, '', pathname);
        });
    }, [searchParams, pathname, status, hasAnyCompetitiveForScroll]);

    useEffect(() => {
        if (!jobId || status !== 'complete') return;
        const hasCompetitiveData =
            (payload?.competitiveByModel && Object.keys(payload.competitiveByModel).length > 0) ||
            !!payload?.competitive?.metrics?.length;
        if (!hasCompetitiveData) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(apiScanGeoEeatCompetitiveHistory(jobId, 20));
                if (!res.ok || cancelled) return;
                const data = await res.json();
                if (cancelled) return;
                setCompetitiveHistory(data.runs ?? []);
            } catch {
                if (!cancelled) setCompetitiveHistory([]);
            }
        })();
        return () => { cancelled = true; };
    }, [jobId, status, payload?.competitiveByModel, payload?.competitive?.metrics?.length]);

    useEffect(() => {
        if (!jobId || selectedCompetitiveRunId == null) {
            setHistoryCompetitiveByModel(null);
            return;
        }
        setHistoryLoading(true);
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(apiScanGeoEeatCompetitiveRun(jobId, selectedCompetitiveRunId));
                if (!res.ok || cancelled) {
                    if (!cancelled) setHistoryCompetitiveByModel(null);
                    return;
                }
                const data = await res.json();
                if (cancelled) return;
                setHistoryCompetitiveByModel(data.competitiveByModel ?? null);
            } catch {
                if (!cancelled) setHistoryCompetitiveByModel(null);
            } finally {
                if (!cancelled) setHistoryLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [jobId, selectedCompetitiveRunId]);

    if (!jobId) {
        return (
            <Box sx={amcMobileFlushPageShellSx(900)}>
                <MsqdxTypography variant="body1" color="text.secondary">
                    {t('geoEeat.missingJobId')}
                </MsqdxTypography>
                <Link href={PATH_SCAN}>
                    <MsqdxButton variant="text" size="small" sx={{ mt: 1 }}>
                        {t('geoEeat.backToScan')}
                    </MsqdxButton>
                </Link>
            </Box>
        );
    }

    if (status === 'loading' || status === 'running') {
        return (
            <Box sx={{ ...amcMobileFlushPageShellSx(900), textAlign: 'center', py: 6 }}>
                <CircularProgress size={40} sx={{ color: MSQDX_BRAND_PRIMARY.green }} />
                <MsqdxTypography variant="body1" sx={{ mt: 2, color: 'var(--color-text-muted-on-light)' }}>
                    {t('geoEeat.statusRunning')}
                </MsqdxTypography>
                <MsqdxTypography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'var(--color-text-muted-on-light)' }}>
                    {url || jobId}
                </MsqdxTypography>
            </Box>
        );
    }

    if (status === 'error') {
        return (
            <Box sx={amcMobileFlushPageShellSx(900)}>
                <MsqdxMoleculeCard
                    title={t('geoEeat.statusError')}
                    variant="flat"
                    sx={{ bgcolor: 'var(--color-card-bg)', borderColor: MSQDX_STATUS.error.base }}
                >
                    <MsqdxTypography variant="body2" sx={{ color: 'var(--color-text-muted-on-light)' }}>
                        {error || t('geoEeat.unknownError')}
                    </MsqdxTypography>
                    <Box sx={{ mt: 2 }}>
                        <Link href={PATH_SCAN}>
                            <MsqdxButton variant="outlined" size="medium">
                                {t('geoEeat.backToScan')}
                            </MsqdxButton>
                        </Link>
                    </Box>
                </MsqdxMoleculeCard>
            </Box>
        );
    }

    const hasCompetitive = payload?.competitive?.metrics?.length;
    const hasAnyCompetitive = hasCompetitive || (sourceByModel && Object.keys(sourceByModel).length > 0);
    const maxWidth = hasAnyCompetitive ? 1200 : 1000;
    const canRerunCompetitive = hasAnyCompetitive && jobId;

    const sectionJumps = [
        ...(payload?.pages && payload.pages.length > 0
            ? [{ id: 'geo-eeat-onpage', label: t('geoEeat.onPageTitle') }]
            : []),
        ...(hasAnyCompetitive ? [{ id: 'geo-eeat-competitive', label: t('geoEeat.competitiveTitle') }] : []),
    ];

    const handleRerunCompetitive = async () => {
        if (!jobId || rerunLoading) return;
        setRerunLoading(true);
        try {
            const res = await fetch(apiScanGeoEeatRerunCompetitive(jobId), { method: 'POST' });
            if (res.ok) {
                setError(null);
                setStatus('running');
            } else {
                const err = await res.json().catch(() => ({}));
                setError((err as { error?: string })?.error ?? t('geoEeat.rerunCompetitiveError'));
                setStatus('error');
            }
        } catch {
            setError(t('geoEeat.rerunCompetitiveError'));
            setStatus('error');
        } finally {
            setRerunLoading(false);
        }
    };

    return (
        <Box sx={amcMobileFlushPageShellSx(maxWidth)}>
            <GeoEeatPageToolbar
                title={t('geoEeat.title')}
                backLabel={t('geoEeat.backToScan')}
                rerunLabel={t('geoEeat.rerunCompetitiveButton')}
                rerunRunningLabel={t('geoEeat.rerunCompetitiveRunning')}
                canRerunCompetitive={Boolean(canRerunCompetitive)}
                rerunLoading={rerunLoading}
                onRerun={handleRerunCompetitive}
                jobId={jobId}
                projectId={projectId}
                onProjectAssigned={() =>
                    fetch(apiScanGeoEeat(jobId))
                        .then((r) => r.json())
                        .then((d: { projectId?: string | null }) => setProjectId(d.projectId ?? null))
                }
            />

            <GeoEeatSectionJumpNav sections={sectionJumps} />

            {url && (
                <MsqdxTypography variant="body2" color="text.secondary" sx={{ mb: 2, px: { xs: 'var(--msqdx-spacing-md)', md: 0 } }}>
                    {payload?.competitiveOnly && payload?.companyHost
                        ? t('geoEeat.competitiveOnlyCompanyLine', { company: payload.companyHost })
                        : url}
                </MsqdxTypography>
            )}

            {payload?.pages && payload.pages.length > 0 && (
                <Box id="geo-eeat-onpage" sx={{ scrollMarginTop: 80 }}>
                <MsqdxMoleculeCard
                    title={t('geoEeat.onPageTitle')}
                    variant="flat"
                    sx={{ bgcolor: 'var(--color-card-bg)', mb: 2, ...amcMobileFlushCardSx }}
                    borderRadius="lg"
                >
                    {payload.pages.map((page: GeoEeatPageResult, idx: number) => {
                        const tech = page.technical;
                        const gen = tech?.generative;
                        const eeatSignals = tech?.eeatSignals;
                        return (
                            <Box key={idx} sx={{ mb: idx < payload.pages!.length - 1 ? 2 : 0, pb: idx < payload.pages!.length - 1 ? 2 : 0, borderBottom: idx < payload.pages!.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                                <MsqdxTypography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    {page.title || page.url}
                                </MsqdxTypography>
                                <MsqdxTypography variant="caption" sx={{ display: 'block', color: 'var(--color-text-muted-on-light)', wordBreak: 'break-all' }}>
                                    {page.url}
                                </MsqdxTypography>

                                {/* Technical (Stufe 1): GEO / Schema / Crawl */}
                                {gen && (
                                    <Box sx={{ mt: 1.5 }}>
                                        <MsqdxTypography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted-on-light)', display: 'block', mb: 0.5 }}>{t('geoEeat.geoAndTech')}</MsqdxTypography>
                                        {compact ? (
                                            <GeoEeatCollapsibleChips
                                                moreLabel={(n) => t('geoEeat.chipsMore', { count: n })}
                                                lessLabel={t('geoEeat.chipsLess')}
                                            >
                                                <MsqdxChip size="small" label={`${t('geoEeat.geoScore')}: ${gen.score}`} />
                                                {gen.technical?.hasLlmsTxt != null && (
                                                    <MsqdxChip size="small" label={gen.technical.hasLlmsTxt ? t('geoEeat.hasLlmsTxt') : t('geoEeat.noLlmsTxt')} />
                                                )}
                                                {gen.technical?.hasRobotsAllowingAI != null && (
                                                    <MsqdxChip size="small" label={gen.technical.hasRobotsAllowingAI ? t('geoEeat.robotsAiAllowed') : t('geoEeat.robotsAiRestricted')} />
                                                )}
                                                {gen.technical?.schemaCoverage?.length ? (
                                                    <MsqdxChip size="small" label={`${t('geoEeat.schemaLabel')}: ${gen.technical.schemaCoverage.slice(0, 3).join(', ')}${gen.technical.schemaCoverage.length > 3 ? '…' : ''}`} />
                                                ) : null}
                                                {gen.content?.faqCount != null && gen.content.faqCount > 0 && (
                                                    <MsqdxChip size="small" label={`${t('geoEeat.faqLabel')}: ${gen.content.faqCount}`} />
                                                )}
                                                {gen.content?.citationDensity != null && (
                                                    <MsqdxChip size="small" label={`${t('geoEeat.citationsLabel')}: ${typeof gen.content.citationDensity === 'number' ? gen.content.citationDensity.toFixed(1) : gen.content.citationDensity}`} />
                                                )}
                                                {gen.expertise?.hasAuthorBio != null && (
                                                    <MsqdxChip size="small" label={gen.expertise.hasAuthorBio ? t('geoEeat.hasAuthorBio') : t('geoEeat.noAuthorBio')} />
                                                )}
                                            </GeoEeatCollapsibleChips>
                                        ) : (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                <MsqdxChip size="small" label={`${t('geoEeat.geoScore')}: ${gen.score}`} />
                                                {gen.technical?.hasLlmsTxt != null && (
                                                    <MsqdxChip size="small" label={gen.technical.hasLlmsTxt ? t('geoEeat.hasLlmsTxt') : t('geoEeat.noLlmsTxt')} />
                                                )}
                                                {gen.technical?.hasRobotsAllowingAI != null && (
                                                    <MsqdxChip size="small" label={gen.technical.hasRobotsAllowingAI ? t('geoEeat.robotsAiAllowed') : t('geoEeat.robotsAiRestricted')} />
                                                )}
                                                {gen.technical?.schemaCoverage?.length ? (
                                                    <MsqdxChip size="small" label={`${t('geoEeat.schemaLabel')}: ${gen.technical.schemaCoverage.slice(0, 3).join(', ')}${gen.technical.schemaCoverage.length > 3 ? '…' : ''}`} />
                                                ) : null}
                                                {gen.content?.faqCount != null && gen.content.faqCount > 0 && (
                                                    <MsqdxChip size="small" label={`${t('geoEeat.faqLabel')}: ${gen.content.faqCount}`} />
                                                )}
                                                {gen.content?.citationDensity != null && (
                                                    <MsqdxChip size="small" label={`${t('geoEeat.citationsLabel')}: ${typeof gen.content.citationDensity === 'number' ? gen.content.citationDensity.toFixed(1) : gen.content.citationDensity}`} />
                                                )}
                                                {gen.expertise?.hasAuthorBio != null && (
                                                    <MsqdxChip size="small" label={gen.expertise.hasAuthorBio ? t('geoEeat.hasAuthorBio') : t('geoEeat.noAuthorBio')} />
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                )}

                                {/* E-E-A-T Signale (Stufe 1: regelbasiert) */}
                                {(eeatSignals || tech?.hasImpressum != null || tech?.hasPrivacy != null) && (
                                    <Box sx={{ mt: 1 }}>
                                        <MsqdxTypography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted-on-light)', display: 'block', mb: 0.5 }}>{t('geoEeat.eeatSignalsPage')}</MsqdxTypography>
                                        {compact ? (
                                            <GeoEeatCollapsibleChips
                                                moreLabel={(n) => t('geoEeat.chipsMore', { count: n })}
                                                lessLabel={t('geoEeat.chipsLess')}
                                            >
                                                {eeatSignals?.hasImpressum != null && <MsqdxChip size="small" label={eeatSignals.hasImpressum ? t('geoEeat.hasImpressum') : t('geoEeat.noImpressum')} sx={eeatSignals.hasImpressum ? { bgcolor: alpha(MSQDX_STATUS.success.base, 0.12), color: MSQDX_STATUS.success.base } : {}} />}
                                                {eeatSignals?.hasContact != null && <MsqdxChip size="small" label={eeatSignals.hasContact ? t('geoEeat.hasContact') : t('geoEeat.noContact')} sx={eeatSignals.hasContact ? { bgcolor: alpha(MSQDX_STATUS.success.base, 0.12), color: MSQDX_STATUS.success.base } : {}} />}
                                                {eeatSignals?.hasAboutLink != null && <MsqdxChip size="small" label={eeatSignals.hasAboutLink ? t('geoEeat.hasAboutLink') : t('geoEeat.noAboutLink')} sx={eeatSignals.hasAboutLink ? { bgcolor: alpha(MSQDX_STATUS.success.base, 0.12), color: MSQDX_STATUS.success.base } : {}} />}
                                                {eeatSignals?.hasTeamLink != null && <MsqdxChip size="small" label={eeatSignals.hasTeamLink ? t('geoEeat.hasTeamLink') : t('geoEeat.noTeamLink')} sx={eeatSignals.hasTeamLink ? { bgcolor: alpha(MSQDX_STATUS.success.base, 0.12), color: MSQDX_STATUS.success.base } : {}} />}
                                                {tech?.hasPrivacy != null && <MsqdxChip size="small" label={tech.hasPrivacy ? t('geoEeat.hasPrivacy') : t('geoEeat.noPrivacy')} sx={tech.hasPrivacy ? { bgcolor: alpha(MSQDX_STATUS.success.base, 0.12), color: MSQDX_STATUS.success.base } : {}} />}
                                            </GeoEeatCollapsibleChips>
                                        ) : (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {eeatSignals?.hasImpressum != null && <MsqdxChip size="small" label={eeatSignals.hasImpressum ? t('geoEeat.hasImpressum') : t('geoEeat.noImpressum')} sx={eeatSignals.hasImpressum ? { bgcolor: alpha(MSQDX_STATUS.success.base, 0.12), color: MSQDX_STATUS.success.base } : {}} />}
                                                {eeatSignals?.hasContact != null && <MsqdxChip size="small" label={eeatSignals.hasContact ? t('geoEeat.hasContact') : t('geoEeat.noContact')} sx={eeatSignals.hasContact ? { bgcolor: alpha(MSQDX_STATUS.success.base, 0.12), color: MSQDX_STATUS.success.base } : {}} />}
                                                {eeatSignals?.hasAboutLink != null && <MsqdxChip size="small" label={eeatSignals.hasAboutLink ? t('geoEeat.hasAboutLink') : t('geoEeat.noAboutLink')} sx={eeatSignals.hasAboutLink ? { bgcolor: alpha(MSQDX_STATUS.success.base, 0.12), color: MSQDX_STATUS.success.base } : {}} />}
                                                {eeatSignals?.hasTeamLink != null && <MsqdxChip size="small" label={eeatSignals.hasTeamLink ? t('geoEeat.hasTeamLink') : t('geoEeat.noTeamLink')} sx={eeatSignals.hasTeamLink ? { bgcolor: alpha(MSQDX_STATUS.success.base, 0.12), color: MSQDX_STATUS.success.base } : {}} />}
                                                {tech?.hasPrivacy != null && <MsqdxChip size="small" label={tech.hasPrivacy ? t('geoEeat.hasPrivacy') : t('geoEeat.noPrivacy')} sx={tech.hasPrivacy ? { bgcolor: alpha(MSQDX_STATUS.success.base, 0.12), color: MSQDX_STATUS.success.base } : {}} />}
                                            </Box>
                                        )}
                                    </Box>
                                )}

                                {/* LLM: E-E-A-T Bewertung (Stufe 2) */}
                                {page.eeatScores && (
                                    <Box sx={{ mt: 1 }}>
                                        <MsqdxTypography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted-on-light)', display: 'block', mb: 0.5 }}>{t('geoEeat.eeatEvalAi')}</MsqdxTypography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                            {[
                                                { key: 'trust', label: t('geoEeat.trust'), score: page.eeatScores.trust },
                                                { key: 'experience', label: t('geoEeat.experience'), score: page.eeatScores.experience },
                                                { key: 'expertise', label: t('geoEeat.expertise'), score: page.eeatScores.expertise },
                                                ...(page.eeatScores.authoritativeness ? [{ key: 'authoritativeness', label: t('geoEeat.authoritativeness'), score: page.eeatScores.authoritativeness }] : []),
                                            ].map(({ key, label, score }) => (
                                                <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <MsqdxTypography variant="caption" sx={{ minWidth: 90 }}>{label}</MsqdxTypography>
                                                    <Box sx={{ flex: 1, maxWidth: compact ? '100%' : 120, height: 8, borderRadius: 1, bgcolor: 'var(--color-border)', overflow: 'hidden', display: 'flex' }}>
                                                        <Box
                                                            sx={{
                                                                width: `${(score.score / 5) * 100}%`,
                                                                height: '100%',
                                                                bgcolor: score.score >= 4 ? MSQDX_STATUS.success.base : score.score >= 3 ? MSQDX_STATUS.warning.base : MSQDX_STATUS.error.base,
                                                                borderRadius: 1,
                                                            }}
                                                        />
                                                    </Box>
                                                    <MsqdxTypography variant="caption" sx={{ fontWeight: 600 }}>{score.score}/5</MsqdxTypography>
                                                </Box>
                                            ))}
                                        </Box>
                                        {(page.eeatScores.trust.reasoning || page.eeatScores.experience.reasoning) && (
                                            <GeoEeatReasoningDisclosure
                                                text={[
                                                    page.eeatScores.trust.reasoning
                                                        ? `${t('geoEeat.trustReasoningPrefix')}: ${page.eeatScores.trust.reasoning}`
                                                        : '',
                                                    page.eeatScores.experience.reasoning
                                                        ? `${t('geoEeat.experienceReasoningPrefix')}: ${page.eeatScores.experience.reasoning}`
                                                        : '',
                                                ]
                                                    .filter(Boolean)
                                                    .join(' · ')}
                                                showLabel={t('geoEeat.showReasoning')}
                                                hideLabel={t('geoEeat.hideReasoning')}
                                            />
                                        )}
                                    </Box>
                                )}

                                {/* LLM: GEO-Fitness (Stufe 3) */}
                                {page.geoFitnessScore != null && (
                                    <Box sx={{ mt: 1 }}>
                                        <MsqdxTypography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted-on-light)', display: 'block', mb: 0.5 }}>{t('geoEeat.geoFitnessAi')}</MsqdxTypography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                            <Box sx={{ flex: 1, maxWidth: compact ? '100%' : 200, height: 12, borderRadius: 1, bgcolor: 'var(--color-border)', overflow: 'hidden', display: 'flex' }}>
                                                <Box
                                                    sx={{
                                                        width: `${page.geoFitnessScore}%`,
                                                        height: '100%',
                                                        bgcolor: page.geoFitnessScore >= 60 ? MSQDX_STATUS.success.base : page.geoFitnessScore >= 30 ? MSQDX_STATUS.warning.base : MSQDX_STATUS.error.base,
                                                        borderRadius: 1,
                                                    }}
                                                />
                                            </Box>
                                            <MsqdxTypography variant="body2" sx={{ fontWeight: 600 }}>{page.geoFitnessScore}/100</MsqdxTypography>
                                        </Box>
                                        {page.geoFitnessReasoning ? (
                                            <GeoEeatReasoningDisclosure
                                                text={page.geoFitnessReasoning}
                                                showLabel={t('geoEeat.showReasoning')}
                                                hideLabel={t('geoEeat.hideReasoning')}
                                            />
                                        ) : null}
                                        {page.missingGeoElements && page.missingGeoElements.length > 0 && (
                                            <MsqdxTypography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'var(--color-text-muted-on-light)' }}>
                                                {t('geoEeat.missingWeakLabel')}: {page.missingGeoElements.join(', ')}
                                            </MsqdxTypography>
                                        )}
                                    </Box>
                                )}

                                {!page.eeatScores && page.geoFitnessScore == null && (gen || eeatSignals) && (
                                    <MsqdxTypography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic', color: 'var(--color-text-muted-on-light)' }}>
                                        {t('geoEeat.llmUnavailableHint')}
                                    </MsqdxTypography>
                                )}
                            </Box>
                        );
                    })}
                </MsqdxMoleculeCard>
                </Box>
            )}

            <Box id="geo-eeat-competitive" sx={{ scrollMarginTop: 80 }}>
            {(hasMultiModelFromSource || hasCompetitive) && (() => {
                if (selectedCompetitiveRunId != null && historyLoading) {
                    return (
                        <MsqdxMoleculeCard
                            title={t('geoEeat.competitiveTitle')}
                            variant="flat"
                            sx={{ bgcolor: 'var(--color-card-bg)', mb: 2 }}
                            borderRadius="lg"
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
                                <CircularProgress size={24} sx={{ color: MSQDX_BRAND_PRIMARY.green }} />
                                <MsqdxTypography variant="body2" sx={{ color: 'var(--color-text-muted-on-light)' }}>
                                    {t('geoEeat.competitiveHistoryLoading')}
                                </MsqdxTypography>
                            </Box>
                        </MsqdxMoleculeCard>
                    );
                }
                const modelIndex = hasMultiModelFromSource
                    ? Math.min(competitiveModelIndex, competitiveModelsFromSource.length - 1)
                    : 0;
                const comp: CompetitiveBenchmarkResult | undefined =
                    hasMultiModelFromSource && sourceByModel
                        ? sourceByModel[competitiveModelsFromSource[modelIndex]!]
                        : (payload?.competitive as CompetitiveBenchmarkResult | undefined);
                const currentModelLabel = hasMultiModelFromSource ? competitiveModelsFromSource[modelIndex] ?? '' : null;
                if (!comp?.metrics) {
                    return (
                        <MsqdxMoleculeCard
                            title={t('geoEeat.competitiveTitle')}
                            variant="flat"
                            sx={{ bgcolor: 'var(--color-card-bg)', mb: 2 }}
                            borderRadius="lg"
                        >
                            <MsqdxTypography variant="body2" color="text.secondary">
                                {selectedCompetitiveRunId != null ? t('geoEeat.noResultsDisplay') : t('geoEeat.noResultsDisplay')}
                            </MsqdxTypography>
                        </MsqdxMoleculeCard>
                    );
                }
                const maxSoV = Math.max(...comp.metrics.map((m) => m.shareOfVoice), 0.01);
                const DOMAIN_COLORS = [
                    MSQDX_BRAND_PRIMARY.green,
                    MSQDX_BRAND_PRIMARY.purple ?? '#7c3aed',
                    '#0ea5e9',
                    '#f59e0b',
                    '#ef4444',
                    '#ec4899',
                    '#14b8a6',
                    '#6366f1',
                ];
                const borderColor = MSQDX_NEUTRAL[200] ?? 'var(--color-border)';
                const textPrimary = MSQDX_THEME?.light?.text?.primary ?? 'var(--color-text-on-light)';
                const textTertiary = MSQDX_THEME?.light?.text?.tertiary ?? 'var(--color-text-muted-on-light)';
                const surfacePrimary = MSQDX_THEME?.light?.surface?.primary ?? 'var(--color-card-bg)';
                const tableBorder = `1px solid ${borderColor}`;
                const brSpacing = MSQDX_SPACING.borderRadius as Record<string, unknown> | undefined;
                const radiusSm = typeof brSpacing?.sm === 'number' ? brSpacing.sm : 4;

                const formatHistoryDate = (iso: string) =>
                    new Date(iso).toLocaleString(undefined, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                const runOptions = buildCompetitiveRunOptions(
                    t('geoEeat.competitiveRunCurrentLabel'),
                    competitiveHistory,
                    formatHistoryDate,
                );
                const effectiveRunTabIndex = competitiveRunIndexFromSelection(selectedCompetitiveRunId, competitiveHistory);

                return (
                    <MsqdxMoleculeCard
                        title={t('geoEeat.competitiveTitle')}
                        variant="flat"
                        sx={{ bgcolor: surfacePrimary, mb: 'var(--msqdx-spacing-sm)', ...amcMobileFlushCardSx }}
                        borderRadius="lg"
                    >
                        {(competitiveHistory.length > 0 || hasMultiModelFromSource) && (
                            <Box sx={{ borderBottom: tableBorder, mb: 0 }}>
                                <GeoEeatCompetitiveRunSelector
                                    options={runOptions}
                                    selectedIndex={effectiveRunTabIndex}
                                    selectLabel={t('geoEeat.competitiveRunSelectLabel')}
                                    onChange={(index, runId) => setSelectedCompetitiveRunId(runId)}
                                />
                                {historyLoading && selectedCompetitiveRunId != null && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--msqdx-spacing-xs)', py: 'var(--msqdx-spacing-xs)', px: 'var(--msqdx-spacing-sm)' }}>
                                        <CircularProgress size={16} sx={{ color: MSQDX_BRAND_PRIMARY.green }} />
                                        <MsqdxTypography variant="caption" sx={{ color: textTertiary }}>
                                            {t('geoEeat.competitiveHistoryLoading')}
                                        </MsqdxTypography>
                                    </Box>
                                )}
                            </Box>
                        )}
                        {hasMultiModelFromSource && sourceByModel && url && (
                            <CompetitivePositionDiagram
                                competitiveByModel={sourceByModel}
                                targetUrl={url}
                                t={t}
                            />
                        )}
                        {hasMultiModelFromSource && competitiveModelsFromSource.length > 0 && (
                            <Box sx={{ borderBottom: tableBorder, mt: 'var(--msqdx-spacing-sm)' }}>
                                <GeoEeatCompetitiveModelSelector
                                    models={competitiveModelsFromSource}
                                    modelIndex={modelIndex}
                                    onChange={setCompetitiveModelIndex}
                                    selectLabel={t('geoEeat.competitiveModelSelectLabel')}
                                />
                            </Box>
                        )}
                        {currentModelLabel && (
                            <MsqdxTypography variant="caption" sx={{ color: textTertiary, display: 'block', mt: 'var(--msqdx-spacing-sm)', mb: 'var(--msqdx-spacing-xxs)' }}>
                                {t('geoEeat.competitiveModelLabel', { model: currentModelLabel })}
                            </MsqdxTypography>
                        )}
                        <Box sx={{ mb: 'var(--msqdx-spacing-md)' }}>
                            <MsqdxTypography variant="subtitle1" sx={{ fontWeight: 600, mb: 'var(--msqdx-spacing-sm)', color: textPrimary }}>
                                {t('geoEeat.competitiveOverview')}
                            </MsqdxTypography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 'var(--msqdx-spacing-sm)' }}>
                                {comp.metrics.map((m, idx) => (
                                    <GeoEeatCompetitiveMetricRow
                                        key={idx}
                                        domain={m.domain}
                                        shareOfVoicePct={`${(m.shareOfVoice * 100).toFixed(0)}%`}
                                        barWidthPct={(m.shareOfVoice / maxSoV) * 100}
                                        avgPositionLabel={`${t('geoEeat.avgPosition')}: ${m.avgPosition > 0 ? m.avgPosition.toFixed(1) : '–'}`}
                                        barColor={DOMAIN_COLORS[idx % DOMAIN_COLORS.length]}
                                        hoverBg={alpha(DOMAIN_COLORS[idx % DOMAIN_COLORS.length], 0.06)}
                                        tooltipTitle={t('geoEeat.tooltipSoVDetail', {
                                            domain: m.domain,
                                            sov: (m.shareOfVoice * 100).toFixed(0),
                                            avgPos: m.avgPosition > 0 ? m.avgPosition.toFixed(1) : '–',
                                            mentions: m.mentionCount,
                                            queries: m.queryCount,
                                            queriesLabel: t('geoEeat.queriesLabel'),
                                        })}
                                        radiusSm={radiusSm}
                                        borderColor={borderColor}
                                        textPrimary={textPrimary}
                                        textTertiary={textTertiary}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {comp.runs && comp.runs.length > 0 && (
                            <Box sx={{ mt: 'var(--msqdx-spacing-md)', pt: 'var(--msqdx-spacing-md)', borderTop: tableBorder }}>
                                <MsqdxTypography variant="subtitle1" sx={{ fontWeight: 600, mb: 'var(--msqdx-spacing-sm)', color: textPrimary }}>
                                    {t('geoEeat.competitivePerQuery')}
                                </MsqdxTypography>
                                <MsqdxAccordion
                                    allowMultiple={!compact}
                                    size="small"
                                    borderRadius="md"
                                    sx={{
                                        border: tableBorder,
                                        bgcolor: surfacePrimary,
                                        background: surfacePrimary,
                                    }}
                                >
                                    {comp.runs.map((run, runIdx) => (
                                        <MsqdxAccordionItem
                                            key={run.queryId ?? runIdx}
                                            id={`query-${runIdx}`}
                                            summary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 'var(--msqdx-spacing-xs)', flexWrap: 'wrap' }}>
                                                    <MsqdxTypography variant="caption" sx={{ fontWeight: 600 }}>
                                                        {t('geoEeat.queryN', { n: runIdx + 1 })}
                                                    </MsqdxTypography>
                                                    <MsqdxTypography
                                                        variant="body2"
                                                        sx={{
                                                            color: textTertiary,
                                                            flex: 1,
                                                            minWidth: 0,
                                                            ...(compact
                                                                ? {
                                                                      display: '-webkit-box',
                                                                      WebkitLineClamp: 2,
                                                                      WebkitBoxOrient: 'vertical',
                                                                      overflow: 'hidden',
                                                                  }
                                                                : {
                                                                      overflow: 'hidden',
                                                                      textOverflow: 'ellipsis',
                                                                      whiteSpace: 'nowrap',
                                                                  }),
                                                        }}
                                                    >
                                                        {run.query}
                                                    </MsqdxTypography>
                                                    {run.citations?.length ? (
                                                        <MsqdxChip size="small" label={t('geoEeat.competitiveCitationsCount', { count: run.citations.length })} />
                                                    ) : null}
                                                </Box>
                                            }
                                        >
                                            <Box sx={{ pt: 'var(--msqdx-spacing-xs)' }}>
                                                <MsqdxTypography variant="body2" sx={{ mb: 'var(--msqdx-spacing-sm)', color: textPrimary }}>
                                                    {run.query}
                                                </MsqdxTypography>
                                                <MsqdxTypography variant="caption" sx={{ color: textTertiary, display: 'block', mb: 'var(--msqdx-spacing-xxs)' }}>
                                                    {t('geoEeat.citedDomains')}:
                                                </MsqdxTypography>
                                                <GeoEeatQueryCitationList
                                                    citations={run.citations ?? []}
                                                    positionLabel={(pos) => `${t('geoEeat.positionShort')} ${pos}`}
                                                    noCitationsLabel={t('geoEeat.noCitations')}
                                                    radiusSm={radiusSm}
                                                    tableBorder={tableBorder}
                                                    surfacePrimary={surfacePrimary}
                                                    textTertiary={textTertiary}
                                                />
                                            </Box>
                                        </MsqdxAccordionItem>
                                    ))}
                                </MsqdxAccordion>
                            </Box>
                        )}
                    </MsqdxMoleculeCard>
                );
            })()}
            </Box>

            {payload && (!payload.pages || payload.pages.length === 0) && !hasCompetitive && !hasMultiModelFromSource && (
                <MsqdxTypography variant="body2" color="text.secondary" sx={{ px: { xs: 'var(--msqdx-spacing-md)', md: 0 } }}>
                    {t('geoEeat.noResultsDisplay')}
                </MsqdxTypography>
            )}

            <GeoEeatMobileActionBar
                jobId={jobId}
                canRerunCompetitive={Boolean(canRerunCompetitive)}
                rerunLoading={rerunLoading}
                rerunLabel={t('geoEeat.rerunCompetitiveButton')}
                rerunRunningLabel={t('geoEeat.rerunCompetitiveRunning')}
                onRerun={handleRerunCompetitive}
            />
        </Box>
    );
}
