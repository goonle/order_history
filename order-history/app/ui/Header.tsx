export default function Header(props: { children: React.ReactNode; title?: string }) {

    return (
        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <h1 className="text-lg font-semibold">{props.title}</h1>
            <div className="flex items-center gap-3">
                {props.children}
            </div>
        </header>
    );
}
