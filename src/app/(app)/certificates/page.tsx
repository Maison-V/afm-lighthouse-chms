import { PageHeader } from "@/components/shared/page-header";
import { CertificateGenerator } from "@/components/certificates/certificate-generator";
import { CertificatesHistory } from "@/components/certificates/certificates-history";
import { getCertificates, getChurchSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const [certificates, settings] = await Promise.all([getCertificates(), getChurchSettings()]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Certificates"
        title="Generate and issue"
        description="Create premium, print-ready certificates for baptism, membership, marriage, dedication, and confirmation."
      />
      <CertificateGenerator logoUrl={settings.logoUrl} seniorPastor={settings.seniorPastor} />
      <CertificatesHistory certificates={certificates} />
    </div>
  );
}
