import { ChurchLogo } from "@/components/shared/church-logo";

const typeCopy: Record<string, { title: string; body: string }> = {
  baptism: {
    title: "Certificate of Baptism",
    body: "having confessed faith in Jesus Christ and been baptised by full immersion in water, in obedience to His command",
  },
  membership: {
    title: "Certificate of Membership",
    body: "is a covenant member in good standing of this local body of believers",
  },
  marriage: {
    title: "Certificate of Marriage",
    body: "were joined together in holy matrimony before God and this congregation",
  },
  dedication: {
    title: "Certificate of Dedication",
    body: "was presented and dedicated to the Lord by their family, in the presence of this congregation",
  },
  confirmation: {
    title: "Certificate of Confirmation",
    body: "affirmed their faith and was confirmed as a member of this congregation",
  },
};

export function CertificatePreview({
  type = "baptism",
  recipient = "Full Name Here",
  date = new Date().toISOString().slice(0, 10),
  logoUrl,
}: {
  type?: string;
  recipient?: string;
  date?: string;
  logoUrl?: string | null;
}) {
  const copy = typeCopy[type] ?? typeCopy.baptism;
  const formatted = new Date(date).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="relative aspect-[1.414/1] w-full overflow-hidden rounded-card border-[3px] border-primary bg-gradient-to-br from-white to-[#F7F9FC] p-3 shadow-soft-lg">
      <div className="flex h-full flex-col items-center justify-between rounded-[10px] border border-gold/50 px-8 py-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-12 w-12">
            <ChurchLogo logoUrl={logoUrl} />
          </div>
          <p className="font-subheading text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">
            AFM Lighthouse Church Vryburg
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">{copy.title}</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">This is to certify that</p>
          <p className="font-heading text-3xl text-foreground sm:text-4xl">{recipient || "Full Name Here"}</p>
          <p className="max-w-md font-scripture text-sm italic leading-relaxed text-muted-foreground">{copy.body}</p>
        </div>

        <div className="flex w-full items-end justify-between text-left">
          <div>
            <p className="border-t border-foreground/30 pt-1 text-xs text-muted-foreground">Pastor Kabelo Sithole</p>
          </div>
          <p className="text-xs text-muted-foreground">{formatted}</p>
        </div>
      </div>
    </div>
  );
}
