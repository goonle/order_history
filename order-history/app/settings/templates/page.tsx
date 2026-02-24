import { Suspense } from "react";
import TemplatesPageClient from "./TemplatesPageClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TemplatesPageClient />
    </Suspense>
  );
}
