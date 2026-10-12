import Link from "next/link";

import { Container } from "@/components/ui/container";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold">Pagina niet gevonden</h1>
      <p className="mt-4">
        <Link href={routes.containers} className="underline">
          Bekijk alle producten
        </Link>
      </p>
    </Container>
  );
}
