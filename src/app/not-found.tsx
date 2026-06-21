import Container from "@/components/Container";
import Button from "@/components/Button";
import { OliveSprig } from "@/components/icons";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <OliveSprig className="h-16 w-16 text-olive/60" />
      <h1 className="mt-6 text-5xl text-olive-deep">This page wandered off</h1>
      <p className="mt-4 max-w-md text-lg text-ink-soft">
        The page you are looking for is not here, but our charcuterie and
        flower cart are only a click away.
      </p>
      <div className="mt-8">
        <Button href="/" withArrow>
          Back to home
        </Button>
      </div>
    </Container>
  );
}
