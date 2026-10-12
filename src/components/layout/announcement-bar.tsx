import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site";

export function AnnouncementBar() {
  return (
    <div className="bg-accent-600 text-[13px] text-white">
      <Container className="flex h-9 items-center justify-between gap-4">
        <p className="flex min-w-0 items-center gap-2">
          <Icon name="clock" className="size-4 shrink-0 text-white" />
          <span className="truncate">
            <strong className="font-bold">Voor 11:00 besteld</strong>{" "}
            = vaak vandaag geleverd
            <span className="hidden sm:inline"> in {siteConfig.contact.area}</span>
          </span>
        </p>
        <div className="hidden items-center gap-6 md:flex">
          <span className="flex items-center gap-2">
            <Icon name="check" className="size-4 text-white" />
            All-in prijzen
          </span>
          <a
            href={siteConfig.contact.phoneHref}
            className="flex items-center gap-2 font-medium text-white hover:underline"
          >
            <Icon name="phone" className="size-4 text-white" />
            {siteConfig.contact.phone}
          </a>
        </div>
      </Container>
    </div>
  );
}
