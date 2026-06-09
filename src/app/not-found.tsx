import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center py-32">
      <Container className="text-center">
        <p className="text-sm font-medium text-muted">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          This page wandered off
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted text-balance">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get
          you back to discovering products.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
