import Image from "next/image";

/**
 * Betaalmethoden als logo's (officiële payment icons, 38×24). Pas de lijst
 * aan op wat in Shopify Payments daadwerkelijk is geactiveerd (CONCEPT).
 */
const methods = [
  { name: "iDEAL", src: "/images/payment/ideal.svg" },
  { name: "Visa", src: "/images/payment/visa.svg" },
  { name: "Mastercard", src: "/images/payment/mastercard.svg" },
  { name: "Apple Pay", src: "/images/payment/apple-pay.svg" },
  { name: "Bancontact", src: "/images/payment/bancontact.svg" },
];

export function PaymentMethods({ className = "" }: { className?: string }) {
  return (
    <ul aria-label="Betaalmethoden" className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {methods.map((method) => (
        <li key={method.name}>
          <Image src={method.src} alt={method.name} title={method.name} width={38} height={24} />
        </li>
      ))}
    </ul>
  );
}
