function CaughtUp() {
    return (
        <div className="text-body-m text-sarge-gray-800 flex flex-1 items-center justify-center">
            You are all caught up!
        </div>
    );
}

export function ContinueGradingSection() {
    return (
        <section className="flex h-[300px] flex-col pt-4 pr-5 pl-4">
            <h2 className="text-label-s text-sarge-gray-600">Continue Grading</h2>
            <CaughtUp />
        </section>
    );
}

export function AwaitingReviewSection() {
    return (
        <section className="border-sarge-gray-200 flex flex-1 flex-col border-t pt-4 pr-5 pl-4">
            <h2 className="text-label-s text-sarge-gray-600">Awaiting Your Review</h2>
            <CaughtUp />
        </section>
    );
}
