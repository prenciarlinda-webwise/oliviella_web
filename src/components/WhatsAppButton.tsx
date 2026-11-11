import { site } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

/** Floating WhatsApp button, bottom right, phones only. */
export default function WhatsAppButton() {
  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Olivella on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 md:hidden"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
