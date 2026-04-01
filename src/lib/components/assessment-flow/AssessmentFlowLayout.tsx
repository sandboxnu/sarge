type AssessmentFlowLayoutProps = {
    navbar: React.ReactNode;
    sidebar: React.ReactNode;
    main: React.ReactNode;
};

export default function AssessmentFlowLayout({ navbar, sidebar, main }: AssessmentFlowLayoutProps) {
    return (
        <div className="flex h-screen w-full flex-col overflow-hidden">
            {navbar}
            <div className="flex flex-1 overflow-hidden">
                {sidebar}
                <main className="flex-1 overflow-hidden">{main}</main>
            </div>
        </div>
    );
}
