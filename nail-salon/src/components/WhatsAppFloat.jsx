import React from "react";

const WhatsAppFloat = () => {
  return (
    <>
      {/* Phone Call Button */}
      <a
        href="tel:+254745557460"
        className="call-float"
        aria-label="Call us"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/254745557460"
        target="_blank"
        rel="noreferrer"
        className="wa-float"
        aria-label="Chat on WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
      </a>

      <style>{`
  /* ── Shared ── */
  .call-float,
  .wa-float {
    position: fixed;
    right: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      transform 0.35s ease,
      box-shadow 0.35s ease,
      background 0.35s ease;
  }

  /* ── Luxury Call Button ── */
  .call-float {
    bottom: 98px;
    width: 48px;
    height: 48px;

    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);

    background: rgba(196, 151, 90, 0.14);
    border: 1px solid rgba(255,255,255,0.12);

    color: #f5f0e8;

    box-shadow:
      0 8px 25px rgba(0,0,0,0.28),
      inset 0 0 0 1px rgba(255,255,255,0.04);

    z-index: 9998;
  }

  .call-float:hover {
    transform: translateY(-4px) scale(1.08);

    background: rgba(196, 151, 90, 0.24);

    box-shadow:
      0 14px 35px rgba(196,151,90,0.22),
      0 0 20px rgba(196,151,90,0.14);
  }

  /* ── Original WhatsApp Button ── */
  .wa-float {
    bottom: 24px;
    right: 24px;
    width: 60px;
    height: 60px;

    background: #25D366;
    color: white;

    box-shadow: 0 8px 25px rgba(0,0,0,0.3);

    z-index: 9999;

    animation: pulse 2s infinite;
  }

  .wa-float:hover {
    transform: scale(1.1);
    animation: none;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
    }

    70% {
      box-shadow: 0 0 0 18px rgba(37, 211, 102, 0);
    }

    100% {
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
    }
  }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .call-float {
      bottom: 88px;
      right: 18px;
      width: 44px;
      height: 44px;
    }

    .wa-float {
      bottom: 18px;
      right: 18px;
      width: 55px;
      height: 55px;
    }
  }
`}</style>
    </>
  );
};

export default WhatsAppFloat;