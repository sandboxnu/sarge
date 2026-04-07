import { Button } from '@/lib/components/ui/Button';

type WindowUnfocusedModalProps = {
    open: boolean;
    onAcknowledge: () => void;
};

export function WindowUnfocusedModal({ open, onAcknowledge }: WindowUnfocusedModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/25 p-4 backdrop-blur-md">
            <div
                aria-labelledby="window-unfocused-title"
                aria-modal="true"
                role="dialog"
                className="bg-sarge-gray-0 border-sarge-gray-200 flex w-full max-w-[380px] flex-col items-center gap-4 rounded-lg border px-8 py-7 text-center shadow-lg"
            >
                <div className="space-y-3">
                    <h2
                        id="window-unfocused-title"
                        className="text-sarge-gray-900 text-base leading-snug font-bold"
                    >
                        You can&apos;t unfocus your assessment window during the exam
                    </h2>
                    <p className="text-sarge-gray-600 text-sm">The admin has been notified.</p>
                </div>
                <Button className="h-9 min-w-28 px-5" type="button" onClick={onAcknowledge}>
                    I understand
                </Button>
            </div>
        </div>
    );
}
