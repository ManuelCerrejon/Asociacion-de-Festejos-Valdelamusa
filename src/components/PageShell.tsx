import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";

type PageShellProps = {
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

export function PageShell({
  children,
  description,
  eyebrow,
  title,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-hueso text-foreground">
      <Header />
      <main>
        <PageHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        {children}
      </main>
      <Footer />
    </div>
  );
}
