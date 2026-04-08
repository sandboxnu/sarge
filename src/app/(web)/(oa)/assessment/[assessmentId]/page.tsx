'use client';

import { use, useCallback, useEffect, useState } from 'react';
import useAssessment from '@/lib/hooks/useAssessment';
import AssessmentIntro from '@/lib/components/assessment-flow/AssessmentIntro';
import AssessmentOutro from '@/lib/components/assessment-flow/AssessmentOutro';
import AssessmentSidebar from '@/lib/components/assessment-flow/AssessmentSidebar';
import AssessmentNavbar from '@/lib/components/assessment-flow/AssessmentNavbar';
import AssessmentContent from '@/lib/components/assessment-flow/AssessmentContent';
import { useHeartbeat } from '@/lib/hooks/useHeartbeat';
import { useWindowUnfocused } from '@/lib/hooks/useWindowUnfocused';
import { LostConnectionModal } from '@/lib/components/modal/LostConnectionModal';
import { WindowUnfocusedModal } from '@/lib/components/modal/WindowUnfocusedModal';
import AssessmentSkeleton from '@/lib/components/assessment-flow/AssessmentSkeleton';

export default function AssessmentPage({ params }: { params: Promise<{ assessmentId: string }> }) {
    const { assessmentId } = use(params);
    const assessment = useAssessment(assessmentId);
    const { isConnected } = useHeartbeat(assessment.token ?? null);
    const isWindowUnfocused = useWindowUnfocused();
    const [isUnfocusedModalOpen, setIsUnfocusedModalOpen] = useState(false);
    const acknowledgeUnfocused = useCallback(() => setIsUnfocusedModalOpen(false), []);

    useEffect(() => {
        if (isWindowUnfocused && !isUnfocusedModalOpen) {
            setIsUnfocusedModalOpen(true);
        }
    }, [isWindowUnfocused, isUnfocusedModalOpen]);

    if (assessment.isLoading)
        return (
            <div className="text-sarge-gray-500 flex h-screen items-center justify-center">
                Loading...
            </div>
        );
    if (assessment.error)
        return (
            <div className="text-sarge-error-400 flex h-screen items-center justify-center">
                {assessment.error.message}
            </div>
        );

    if (assessment.phase === 'intro' && assessment.assessment) {
        return (
            <AssessmentIntro
                assessment={assessment.assessment}
                totalTimeSeconds={assessment.totalTimeSeconds}
                onStart={assessment.startAssessment}
            />
        );
    }

    if (assessment.phase === 'outro') {
        return (
            <AssessmentOutro
                reason={assessment.outroReason}
                candidateName={assessment.candidateName}
            />
        );
    }

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden">
            {/* onOpenChange is returning nothing as we don't have recovery implemented just yet  */}
            <LostConnectionModal open={!isConnected} onOpenChange={() => {}} />
            <WindowUnfocusedModal
                open={isUnfocusedModalOpen}
                onAcknowledge={acknowledgeUnfocused}
            />
            <AssessmentNavbar candidateName={assessment.candidateName} />
            <div className="flex flex-1 overflow-hidden">
                <AssessmentSidebar
                    sections={assessment.sections}
                    currentSectionIndex={assessment.currentSectionIndex}
                    formattedTime={assessment.timer.formattedTime}
                />
                <main className="flex-1 overflow-hidden">
                    {!isConnected ? (
                        <AssessmentSkeleton />
                    ) : (
                        <AssessmentContent
                            currentSection={assessment.currentSection}
                            availableLanguages={assessment.availableLanguages}
                            publicTestCases={assessment.publicTestCases}
                            testCaseResults={assessment.testCaseResults}
                            isTransitioning={assessment.isTransitioning}
                            onLanguageChange={assessment.changeLanguage}
                            onEditorMount={assessment.handleEditorMount}
                            onRunTests={assessment.runTests}
                            onSubmit={assessment.submitAndContinue}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
