/** One Next.js redirect matched on the host. */
export interface DomainRedirect {
  source: string;
  has: { type: "host"; value: string }[];
  destination: string;
  permanent: true;
}
