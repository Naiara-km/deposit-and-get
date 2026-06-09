import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronDown,
  CreditCard,
  Info,
  Ticket,
  Wallet,
  X,
  AlertTriangle,
  Gift,
} from "lucide-react";
import { DepositSignal } from "@/components/DepositSignal";
import { usePromo } from "@/context/PromoContext";
import { asset } from "@/lib/asset";

type SubmitPhase = "idle" | "pending" | "confirmed";
type DepositMethod = "voucher" | "card" | "eft";
type View = "picker" | DepositMethod;

const MOCK_BALANCE = "1,000.00";

/**
 * Deposit page — Figma 6135-14013 (picker) + 6134-14219 / 6134-14325 /
 * 6134-14541 (Voucher / Card / EFT tabs).
 *
 * Two views:
 *   1. Method picker — entry view. Shows balance, Recommended (EFT/Ozow),
 *      and All Deposit Methods (Card, Voucher, Wallet "Available Soon").
 *   2. Method form  — Voucher / Card / EFT tabs at top, method-specific
 *      form below. Tabs swap the form. `X` returns to the picker.
 *
 * All deposit methods qualify for the active promo. The existing
 * DepositSignal awareness component is reused inside Card / EFT forms; the
 * Voucher form shows a simpler awareness banner since there's no amount
 * input there. JOIN PROMO is a single tap from the picker when available.
 */
export function Deposit() {
  const {
    promo,
    state,
    setState,
    redemptions,
    setRedemptions,
    poolRemaining,
    setPoolRemaining,
    currencySymbol,
    isActivelyEarning,
    redemptionsRemaining,
  } = usePromo();
  const navigate = useNavigate();
  const location = useLocation();

  const [view, setView] = useState<View>("picker");
  const [amount, setAmount] = useState<number | "">("");
  const [voucherCode, setVoucherCode] = useState("");
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [sheetOpen, setSheetOpen] = useState(false);

  // External navigation to /deposit always lands on the picker view (the
  // "deposit homepage"). location.key changes on every router push/pop, so
  // this resets the form-state if the user enters via the header balance
  // pill, the sticky DEPOSIT CTA, or any other external link.
  useEffect(() => {
    setView("picker");
    setAmount("");
    setVoucherCode("");
    setPhase("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  const numeric = typeof amount === "number" ? amount : 0;
  // Voucher redemptions assume the voucher value qualifies (R200+) per spec.
  const voucherQualifies = isActivelyEarning && redemptionsRemaining > 0;
  const qualifies =
    view === "voucher"
      ? voucherQualifies
      : isActivelyEarning &&
        redemptionsRemaining > 0 &&
        numeric >= promo.minDeposit;

  /** Pending → resolve: bump redemptions / pool, advance state if cap hit. */
  useEffect(() => {
    if (phase !== "pending") return;
    const t = window.setTimeout(() => {
      if (qualifies) {
        const next = redemptions + 1;
        setRedemptions(next);
        setPoolRemaining(Math.max(0, poolRemaining - 1));
        if (next >= promo.maxRedemptionsPerUser) {
          setState("completed");
        }
      }
      setPhase("confirmed");
    }, 1200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /** Confirmed → show toast briefly, then route to Promo Details. */
  useEffect(() => {
    if (phase !== "confirmed") return;
    const t = window.setTimeout(() => {
      setPhase("idle");
      navigate(`/promotions/${promo.id}`);
    }, 1500);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /** When the user opts in (state flips to "active") OR lands on a Card / EFT
   *  form already opted in with no amount entered yet, pre-fill the amount
   *  with the minimum qualifying deposit so the form is one tap from
   *  earning the reward. */
  useEffect(() => {
    if (
      state === "active" &&
      (view === "card" || view === "eft") &&
      amount === ""
    ) {
      setAmount(promo.minDeposit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, view]);

  function handleSubmit() {
    if (phase !== "idle") return;
    if (view === "voucher" && voucherCode.length < 16) return;
    if ((view === "card" || view === "eft") && !numeric) return;
    setPhase("pending");
  }

  function quickAdd(delta: number) {
    setAmount((numeric || 0) + delta);
  }

  return (
    <main className="relative min-h-screen bg-white pb-24">
      {view === "picker" ? (
        <MethodPicker
          onSelectMethod={(m) => setView(m)}
          onBack={() => navigate(-1)}
        />
      ) : (
        <MethodForm
          method={view}
          onTabChange={(m) => setView(m)}
          onClose={() => setView("picker")}
          onBack={() => navigate(-1)}
          amount={amount}
          numeric={numeric}
          setAmount={setAmount}
          quickAdd={quickAdd}
          voucherCode={voucherCode}
          setVoucherCode={setVoucherCode}
          currencySymbol={currencySymbol}
          phase={phase}
          onSubmit={handleSubmit}
          onShowPromoDetails={() => setSheetOpen(true)}
        />
      )}

      {phase === "confirmed" && (
        <DepositToast
          message={
            qualifies
              ? `Deposit confirmed — ${promo.rewardCount} Bonus Spins on the way`
              : "Deposit confirmed"
          }
        />
      )}

      {sheetOpen && <PromoBottomSheet onClose={() => setSheetOpen(false)} />}
    </main>
  );
}

/* =========================================================== Method picker */

function MethodPicker({
  onSelectMethod,
  onBack,
}: {
  onSelectMethod: (m: DepositMethod) => void;
  onBack: () => void;
}) {
  return (
    <>
      <PickerHeader onBack={onBack} />

      {/* Balance pill */}
      <div className="mx-4 mt-3 flex items-center justify-between rounded-full bg-[#F3F2FB] px-4 py-2.5">
        <span className="text-[13px] font-medium text-dg-ink-sub">
          Your Total Balance
        </span>
        <span className="text-[14px] font-bold text-dg-ink-dark tabular-nums">
          R {MOCK_BALANCE}
        </span>
      </div>

      {/* Brand logo — dark variant (navy "SuperSport") so it stays legible
          on the white Deposit page. The default white-text version is for
          navy backgrounds. */}
      <div className="mt-7 flex justify-center px-4">
        <img
          src={asset("figma/supersportbet-logo-dark.svg")}
          alt="SuperSportBet"
          className="h-9 w-auto"
        />
      </div>

      {/* Promo awareness lives inside the method forms now (Card / EFT),
          not on this picker — keeps the homepage focused on method choice. */}

      {/* Recommended */}
      <SectionHeading>Recommended</SectionHeading>
      <div className="mx-4 mt-2">
        <MethodRow
          icon={<OzowGlyph />}
          label={
            <>
              EFT <span className="font-normal text-dg-ink-sub">(Ozow)</span>
            </>
          }
          onClick={() => onSelectMethod("eft")}
        />
      </div>

      {/* All Deposit Methods */}
      <SectionHeading>All Deposit Methods</SectionHeading>
      <div className="mx-4 mt-2 flex flex-col gap-3">
        <MethodRow
          icon={<CardGlyph />}
          label="Card"
          onClick={() => onSelectMethod("card")}
        />
        <MethodRow
          icon={<VoucherGlyph />}
          label="Voucher"
          onClick={() => onSelectMethod("voucher")}
        />
        <MethodRow
          icon={<WalletGlyph />}
          label="Wallet"
          trailing={<AvailableSoonChip />}
          disabled
        />
      </div>
    </>
  );
}

function PickerHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="flex items-center justify-between px-4 pt-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="flex items-center gap-2 text-dg-ink-dark"
      >
        <ChevronLeft size={22} />
        <span className="text-[18px] font-bold">Deposit</span>
      </button>
      <button
        type="button"
        aria-label="More info"
        className="grid h-9 w-9 place-items-center rounded-full border border-dg-ink-dark/15 text-brand-blue"
      >
        <Info size={18} />
      </button>
    </header>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mx-4 mt-7 text-[16px] font-bold text-dg-ink-dark">
      {children}
    </h2>
  );
}

function MethodRow({
  icon,
  label,
  onClick,
  disabled,
  trailing,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-[12px] border border-dg-ink-dark/10 bg-white px-4 py-3 text-left text-[15px] font-medium text-dg-ink-dark shadow-[0_1px_3px_rgba(20,20,60,0.04)] transition ${
        disabled
          ? "cursor-not-allowed opacity-90"
          : "hover:border-brand-blue/40 hover:shadow-[0_2px_8px_rgba(20,20,60,0.08)]"
      }`}
    >
      <span className="inline-flex h-9 w-12 shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {trailing}
    </button>
  );
}

function AvailableSoonChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE5DD] px-2.5 py-1 text-[11px] font-semibold text-[#D45A2C]">
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-[#D45A2C]"
      />
      Available Soon
    </span>
  );
}

/* =========================================================== Method form  */

function MethodForm({
  method,
  onTabChange,
  onClose,
  onBack,
  amount,
  numeric,
  setAmount,
  quickAdd,
  voucherCode,
  setVoucherCode,
  currencySymbol,
  phase,
  onSubmit,
  onShowPromoDetails,
}: {
  method: DepositMethod;
  onTabChange: (m: DepositMethod) => void;
  onClose: () => void;
  onBack: () => void;
  amount: number | "";
  numeric: number;
  setAmount: (n: number | "") => void;
  quickAdd: (delta: number) => void;
  voucherCode: string;
  setVoucherCode: (s: string) => void;
  currencySymbol: string;
  phase: SubmitPhase;
  onSubmit: () => void;
  onShowPromoDetails: () => void;
}) {
  return (
    <>
      <FormHeader onBack={onBack} onClose={onClose} />
      <MethodTabs method={method} onChange={onTabChange} />
      <div className="px-4 pt-5">
        {method === "voucher" && (
          <VoucherForm
            code={voucherCode}
            setCode={setVoucherCode}
            phase={phase}
            onSubmit={onSubmit}
          />
        )}
        {method === "card" && (
          <CardOrEftForm
            kind="card"
            amount={amount}
            numeric={numeric}
            setAmount={setAmount}
            quickAdd={quickAdd}
            currencySymbol={currencySymbol}
            phase={phase}
            onSubmit={onSubmit}
            onShowPromoDetails={onShowPromoDetails}
          />
        )}
        {method === "eft" && (
          <CardOrEftForm
            kind="eft"
            amount={amount}
            numeric={numeric}
            setAmount={setAmount}
            quickAdd={quickAdd}
            currencySymbol={currencySymbol}
            phase={phase}
            onSubmit={onSubmit}
            onShowPromoDetails={onShowPromoDetails}
          />
        )}
      </div>
    </>
  );
}

function FormHeader({
  onBack,
  onClose,
}: {
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <header className="flex items-center justify-between px-4 pt-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="flex items-center gap-2 text-dg-ink-dark"
      >
        <ChevronLeft size={22} />
        <span className="text-[18px] font-bold">Deposit</span>
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="grid h-9 w-9 place-items-center rounded-full text-dg-ink-sub hover:bg-dg-ink-dark/5"
      >
        <X size={20} />
      </button>
    </header>
  );
}

function MethodTabs({
  method,
  onChange,
}: {
  method: DepositMethod;
  onChange: (m: DepositMethod) => void;
}) {
  const tabs: DepositMethod[] = ["voucher", "card", "eft"];
  return (
    <nav
      aria-label="Deposit method"
      className="mt-3 flex items-center border-b border-dg-ink-dark/10 px-2"
    >
      {tabs.map((t) => {
        const isActive = method === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={`relative flex-1 py-3 text-[14px] transition ${
              isActive
                ? "font-bold text-brand-blue"
                : "font-medium text-dg-ink-sub hover:text-dg-ink-dark"
            }`}
          >
            {t === "voucher"
              ? "Voucher"
              : t === "card"
                ? "Card"
                : "EFT"}
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-brand-blue"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* ===== Voucher form ===== */

function VoucherForm({
  code,
  setCode,
  phase,
  onSubmit,
}: {
  code: string;
  setCode: (s: string) => void;
  phase: SubmitPhase;
  onSubmit: () => void;
}) {
  const valid = code.length >= 16;
  const submitting = phase !== "idle";
  // Voucher deposits are excluded from the promo (per Deposit Criteria table:
  // "Excluded methods: Manual bank transfer, in-store cash" — vouchers also
  // sit outside the eligible set), so no awareness banner shows here.
  return (
    <div className="flex flex-col gap-4">
      {/* Provider */}
      <Field label="Provider">
        <div className="flex items-center justify-between gap-3 rounded-md border-b border-dg-ink-dark/15 bg-[#F3F2FB] px-3 py-2.5">
          <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-dg-ink-dark">
            <span className="grid h-6 w-6 place-items-center rounded-[5px] bg-[#FF6A2B] text-[10px] font-bold text-white">
              1V
            </span>
            1 Voucher
          </span>
          <ChevronDown size={18} className="text-dg-ink-sub" />
        </div>
      </Field>

      {/* Voucher code */}
      <Field label="Voucher Code">
        <input
          type="text"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value.slice(0, 16))}
          placeholder="Enter 16 Digit Voucher PIN"
          className="w-full border-b border-dg-ink-dark/15 bg-[#F3F2FB] px-3 py-3 text-[15px] text-dg-ink-dark placeholder:text-dg-ink-sub/70 focus:border-brand-blue focus:outline-none"
        />
      </Field>

      {/* Warning */}
      <aside
        role="note"
        className="flex items-start gap-3 rounded-[10px] bg-[#FFEEDD] p-4 text-[13px] leading-snug text-[#9A4A18]"
      >
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#D45A2C]" />
        <p>
          Please note that deposits via vouchers are subject to churn
          requirements, in order to withdraw you will need to play through the
          full voucher amount.
        </p>
      </aside>

      <PrimaryCta
        label={submitting ? "PROCESSING…" : "REDEEM VOUCHER"}
        disabled={!valid || submitting}
        onClick={onSubmit}
      />
      <p className="text-center text-[12.5px] text-dg-ink-sub">
        {valid
          ? "Tap REDEEM VOUCHER to confirm"
          : "Please put the voucher code"}
      </p>
    </div>
  );
}

/* ===== Card / EFT form ===== */

function CardOrEftForm({
  kind,
  amount,
  numeric,
  setAmount,
  quickAdd,
  currencySymbol,
  phase,
  onSubmit,
  onShowPromoDetails,
}: {
  kind: "card" | "eft";
  amount: number | "";
  numeric: number;
  setAmount: (n: number | "") => void;
  quickAdd: (delta: number) => void;
  currencySymbol: string;
  phase: SubmitPhase;
  onSubmit: () => void;
  onShowPromoDetails: () => void;
}) {
  const submitting = phase !== "idle";
  const ctaLabel =
    submitting
      ? "PROCESSING…"
      : kind === "card"
        ? "CONTINUE WITH CARD"
        : "CONTINUE WITH EFT";
  // Promo awareness banner sits at the top of Card / EFT forms (Voucher
  // excluded — voucher deposits don't qualify). In `available` state the
  // banner is tappable: clicking opens the PromoBottomSheet with promo
  // details. In `active` state it's static. The DepositSignal below the
  // amount input still handles amount-aware messages.
  return (
    <div className="flex flex-col gap-4">
      <PromoAwarenessBanner onSeeDetails={onShowPromoDetails} />

      {/* EFT-only: provider row */}
      {kind === "eft" && (
        <Field label="Provider">
          <div className="flex items-center gap-2 rounded-md border-b border-dg-ink-dark/15 bg-[#F3F2FB] px-3 py-2.5">
            <OzowGlyph small />
            <span className="text-[14px] font-semibold text-dg-ink-dark">
              Ozow
            </span>
          </div>
        </Field>
      )}

      {/* Amount input + quick chips */}
      <div className="rounded-md bg-[#F3F2FB] px-3 pt-2.5">
        <label className="block">
          <span className="block text-[12px] font-medium text-dg-ink-sub">
            Enter Amount ({currencySymbol})
          </span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full border-b border-dg-ink-dark/15 bg-transparent py-2 text-[18px] font-semibold text-dg-ink-dark placeholder:text-dg-ink-sub/70 focus:border-brand-blue focus:outline-none"
          />
        </label>
        <div className="flex gap-3 pb-3 pt-2 text-[14px] font-bold text-brand-blue">
          {[500, 750, 1000, 1500].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => quickAdd(amt)}
              className="flex-1 rounded-md py-1 transition hover:bg-brand-blue/5"
            >
              +{amt.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <DepositSignal amount={numeric} onShowPromoDetails={onShowPromoDetails} />

      <div className="flex items-center justify-between pt-1">
        <span className="text-[14px] font-bold text-dg-ink-dark">
          Deposit amount
        </span>
        <span className="text-[22px] font-extrabold text-dg-ink-dark tabular-nums">
          {currencySymbol} {numeric.toFixed(2)}
        </span>
      </div>

      <PrimaryCta
        label={ctaLabel}
        disabled={!numeric || submitting}
        onClick={onSubmit}
      />
      <p className="text-center text-[12.5px] text-dg-ink-sub">
        {numeric
          ? `Tap ${kind === "card" ? "CONTINUE WITH CARD" : "CONTINUE WITH EFT"} to confirm`
          : "Please define the amount you want to deposit"}
      </p>
    </div>
  );
}

/* =========================================================== Shared bits */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span className="mb-1 px-1 text-[12px] font-medium text-dg-ink-sub">
        {label}
      </span>
      {children}
    </div>
  );
}

function PrimaryCta({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`mt-1 w-full rounded-full py-3.5 text-[14px] font-extrabold uppercase tracking-[0.06em] transition ${
        disabled
          ? "cursor-not-allowed bg-[#E4E3F0] text-[#A5A1C1]"
          : "bg-brand-blue text-white hover:bg-brand-blue-dark"
      }`}
    >
      {label}
    </button>
  );
}

/**
 * PromoAwarenessBanner — top-of-form banner for the AVAILABLE state only.
 *
 * The user has not opted in yet. Tap the text/icon area → PromoBottomSheet
 * with full details. Inline JOIN button is a shortcut that bypasses the sheet.
 *
 * The active state is handled by DepositSignal below the amount input
 * instead — we no longer show two awareness signals at once.
 */
function PromoAwarenessBanner({
  onSeeDetails,
}: {
  onSeeDetails?: () => void;
}) {
  const { promo, state, isJoining, joinPromo } = usePromo();

  if (state !== "available") return null;

  return (
    <aside
      role="status"
      className="flex items-center justify-between gap-3 rounded-[10px] border border-brand-blue/25 bg-brand-blue/[0.06] px-4 py-3"
    >
      <button
        type="button"
        onClick={onSeeDetails}
        disabled={!onSeeDetails}
        className="flex flex-1 items-start gap-2.5 text-left transition disabled:cursor-default"
        aria-label="See promo details"
      >
        <Gift size={18} className="mt-0.5 shrink-0 text-brand-blue" />
        <span className="text-[13px] leading-snug text-dg-ink-dark">
          <strong>Deposit &amp; Get</strong> available, Join now to earn{" "}
          <strong className="text-brand-blue">
            {promo.rewardCount} Bonus Spins
          </strong>{" "}
          per deposit.{" "}
          {onSeeDetails && (
            <span className="text-brand-blue underline">See details</span>
          )}
        </span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          joinPromo();
        }}
        disabled={isJoining}
        className="shrink-0 whitespace-nowrap rounded-full bg-brand-blue px-4 py-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.06em] text-white disabled:opacity-70"
      >
        {isJoining ? "Joining…" : "Join"}
      </button>
    </aside>
  );
}

/* =========================================================== PromoBottomSheet */

/**
 * Bottom sheet that surfaces promo details from the awareness banner.
 * Slides up from the bottom of the viewport with a dim backdrop. Esc and
 * backdrop-click close. Has Close + Join Promo actions; Join Promo wires
 * to `joinPromo()` from context (with the existing 900ms spinner) and
 * closes the sheet immediately so the user sees the active banner take
 * over once the state flip lands.
 */
function PromoBottomSheet({ onClose }: { onClose: () => void }) {
  const {
    promo,
    state,
    redemptions,
    currencySymbol,
    isJoining,
    joinPromo,
    isActivelyEarning,
  } = usePromo();
  const totalSpins = promo.rewardCount * promo.maxRedemptionsPerUser;
  const min = `${currencySymbol}${promo.minDeposit.toLocaleString()}`;
  const depositWord = promo.maxRedemptionsPerUser === 1 ? "deposit" : "deposits";
  const showJoin = state === "available";
  const showProgress = isActivelyEarning;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleJoin() {
    joinPromo();
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-sheet-title"
      className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-black/55"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white px-5 pb-6 pt-3 shadow-[0_-12px_30px_rgba(8,10,50,0.22)] motion-safe:animate-[slideUp_240ms_ease-out]"
      >
        {/* drag handle */}
        <div
          aria-hidden
          className="mx-auto mb-4 h-1 w-12 rounded-full bg-dg-ink-dark/15"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close promo details"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-dg-ink-sub hover:bg-dg-ink-dark/5"
        >
          <X size={20} />
        </button>

        <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-dg-ink-sub">
          Deposit &amp; Get
        </div>
        <h2
          id="promo-sheet-title"
          className="mt-1 text-[24px] font-extrabold leading-tight"
          style={{ color: "#C99412" }}
        >
          {totalSpins} Bonus Spins
        </h2>
        <p className="mt-1 text-[13.5px] text-dg-ink-sub">
          {promo.maxRedemptionsPerUser} {depositWord} of {min} to win
        </p>

        {/* Emphasis: user has to join before they deposit to benefit. */}
        {showJoin && (
          <aside
            role="note"
            className="mt-4 rounded-[10px] border border-brand-blue/25 bg-brand-blue/[0.06] px-3.5 py-3 text-[13px] leading-snug text-dg-ink-dark"
          >
            <strong>You need to actively join the promo</strong> before
            depositing to start earning Bonus Spins on your deposits.
          </aside>
        )}

        {/* Live progress — only when the user is actively earning. */}
        {showProgress && (
          <aside
            role="status"
            className="mt-4 flex items-center justify-between rounded-[10px] bg-success/10 px-3.5 py-3 text-[13px] text-dg-ink-dark"
          >
            <span className="font-semibold">Your progress</span>
            <span className="text-success font-extrabold tabular-nums">
              {redemptions}/{promo.maxRedemptionsPerUser} deposits done
            </span>
          </aside>
        )}

        <ul className="mt-5 flex flex-col gap-3 text-[13px] text-dg-ink-dark">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-blue/10 text-brand-blue">
              <Gift size={15} />
            </span>
            <span>
              On every <strong>{min}</strong> deposit you earn{" "}
              <strong>{promo.rewardCount} Bonus Spins</strong>
              {promo.maxRedemptionsPerUser > 1 && (
                <>
                  , up to <strong>{totalSpins}</strong> total
                </>
              )}
              .
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-blue/10 text-brand-blue">
              <Check size={15} />
            </span>
            <span>
              Eligible methods: <strong>Card</strong> &amp;{" "}
              <strong>EFT (Ozow)</strong>.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-blue/10 text-brand-blue">
              <Info size={15} />
            </span>
            <span>{promo.campaignWindowLabel}</span>
          </li>
        </ul>

        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-dg-ink-dark/20 bg-white px-4 py-3 text-[13px] font-bold text-dg-ink-dark transition hover:bg-dg-ink-dark/5"
          >
            Close
          </button>
          {showJoin && (
            <button
              type="button"
              onClick={handleJoin}
              disabled={isJoining}
              className="flex-1 rounded-full bg-brand-blue px-4 py-3 text-[13px] font-extrabold uppercase tracking-[0.05em] text-white transition hover:bg-brand-blue-dark disabled:opacity-70"
            >
              {isJoining ? "Joining…" : "Join Promo"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================== Toast & icons */

function DepositToast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed bottom-20 left-1/2 z-30 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 px-3"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-card bg-brand-navy px-4 py-3 text-white shadow-lg">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-success">
          <Check size={16} />
        </span>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

function OzowGlyph({ small }: { small?: boolean }) {
  const size = small ? 18 : 24;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="#1FB495" strokeWidth="2" />
      <path
        d="M7 14a5 5 0 1 1 10 0"
        stroke="#1FB495"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="11" r="2.4" fill="#1FB495" />
    </svg>
  );
}

function CardGlyph() {
  return (
    <span className="grid h-7 w-10 place-items-center rounded-[4px] bg-gradient-to-br from-[#E8E6F0] to-[#C9C4DE]">
      <CreditCard size={18} className="text-[#5A5780]" />
    </span>
  );
}

function VoucherGlyph() {
  return (
    <span className="grid h-7 w-8 place-items-center rounded-[6px] bg-[#FF5C82]">
      <Ticket size={16} className="text-white" />
    </span>
  );
}

function WalletGlyph() {
  return (
    <span className="grid h-7 w-8 place-items-center rounded-[4px] bg-dg-ink-dark">
      <Wallet size={16} className="text-white" />
    </span>
  );
}
