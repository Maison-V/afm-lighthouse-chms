import { PageHeader } from "@/components/shared/page-header";
import { CertificateGenerator } from "@/components/certificates/certificate-generator";
import { CertificatesHistory } from "@/components/certificates/certificates-history";

export default function CertificatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Certificates"
        title="Generate and issue"
        description="Create premium, print-ready certificates for baptism, membership, marriage, dedication, and confirmation."
      />
      <CertificateGenerator />
      <CertificatesHistory />
    </div>
  );
}
