import { useState } from "react";
import api from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../store/userSlice";

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Everything you need to get started",
    cta: "Current plan",
    ctaDisabled: true,
    features: [
      { text: "10 swipes per day", included: true },
      { text: "Basic profile", included: true },
      { text: "View connections", included: true },
      { text: "Real-time chat", included: true },
      { text: "Skill-based matching", included: false },
      { text: "See who liked you", included: false },
      { text: "Unlimited swipes", included: false },
      { text: "Priority in feed", included: false },
      { text: "Profile boost", included: false },
      { text: "Read receipts", included: false },
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    price: { monthly: 499, yearly: 3999 },
    description: "For developers serious about connecting",
    cta: "Get Pro",
    ctaDisabled: false,
    features: [
      { text: "Unlimited swipes", included: true },
      { text: "Basic profile", included: true },
      { text: "View connections", included: true },
      { text: "Real-time chat", included: true },
      { text: "Skill-based matching", included: true },
      { text: "See who liked you", included: true },
      { text: "Read receipts", included: true },
      { text: "Priority in feed", included: false },
      { text: "Profile boost", included: false },
      { text: "Verified badge", included: false },
    ],
  },
  {
    id: "ELITE",
    name: "Elite",
    price: { monthly: 999, yearly: 7999 },
    description: "Maximum visibility, maximum connections",
    cta: "Get Elite",
    ctaDisabled: false,
    features: [
      { text: "Unlimited swipes", included: true },
      { text: "Basic profile", included: true },
      { text: "View connections", included: true },
      { text: "Real-time chat", included: true },
      { text: "Skill-based matching", included: true },
      { text: "See who liked you", included: true },
      { text: "Read receipts", included: true },
      { text: "Priority in feed", included: true },
      { text: "Profile boost (weekly)", included: true },
      { text: "Verified badge", included: true },
    ],
  },
];

const PERKS = [
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "See who liked you",
    desc: "Skip the guessing game. See every developer who swiped right on you.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Priority in feed",
    desc: "Your profile appears first in other developers' feeds. More visibility, more matches.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Verified badge",
    desc: "Stand out with a verified badge on your profile. Build trust instantly.",
  },
  {
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Read receipts",
    desc: "Know when your messages have been read. No more wondering.",
  },
];

const CheckIcon = ({ filled }) =>
  filled ?
    <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
      <svg
        width="8"
        height="8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  : <div className="w-4 h-4 rounded-full bg-[#1e1d28] border border-[#2d2b40] flex-shrink-0" />;

function Premium() {
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const userPlan = user.membershipType || "FREE";

  const getCtaState = (planId, userPlan) => {
    const planRank = { FREE: 0, PRO: 1, ELITE: 2 };
    if (planId === userPlan) return { cta: "Current plan", ctaDisabled: true };
    if (planRank[planId] < planRank[userPlan])
      return { cta: "Downgrade", ctaDisabled: true };
    return {
      cta: `Get ${planId.charAt(0) + planId.slice(1).toLowerCase()}`,
      ctaDisabled: false,
    };
  };

  const pollForUpgrade = async (orderId, planName) => {
    const MAX_ATTEMPTS = 20;
    const INTERVAL_MS = 2000;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await new Promise((r) => setTimeout(r, INTERVAL_MS));

      const res = await api.get(`/payment/status/${orderId}`);
      if (res.data.ready) {
        dispatch(addUser(res.data.user));
        setSuccessMsg(`🎉 You're now on ${planName}!`);
        return;
      }
    }

    setSuccessMsg("Payment received! Your plan will activate shortly.");
  };

  const handleBuyClick = async (plan) => {
    if (loading) return;
    setLoading(true);

    try {
      const order = await api.post("/payment/create", {
        membershipType: plan.id,
        billingCycle: billing.toUpperCase(),
      });

      const { orderId, amount, currency, keyId } = order.data.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "DevLink",
        description: `${plan.name} - ${billing}`,
        order_id: orderId,
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.emailId,
          contact: "",
        },
        theme: { color: "#8E51FF" },

        handler: async function (response) {
          try {
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setSuccessMsg("Processing your payment...");
            await pollForUpgrade(response.razorpay_order_id, plan.name);
          } catch {
            alert(
              "Payment succeeded but verification failed. Contact support.",
            );
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-10 pb-24">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-[#13121c] border border-violet-900/50 rounded-full px-3.5 py-1.5 text-[11px] text-violet-400 uppercase tracking-widest font-medium mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
          DevLink Premium
        </div>
        <h1 className="font-['Outfit'] font-extrabold text-[36px] md:text-[48px] text-white tracking-tight leading-tight mb-4">
          Find your coding partner
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            faster than ever
          </span>
        </h1>
        <p className="text-[15px] text-[#6b6880] max-w-md mx-auto leading-relaxed">
          Unlock unlimited swipes, see who liked you, and get priority placement
          in the feed.
        </p>

        {/* Billing toggle */}
        <div
          className={`inline-flex items-center gap-3 mt-8 bg-[#13121c] border border-[#1e1d28] rounded-xl p-1 ${
            userPlan === "ELITE" ? "opacity-40 pointer-events-none" : ""
          }`}>
          <button
            onClick={() => setBilling("monthly")}
            className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none ${
              billing === "monthly" ?
                "bg-violet-700 text-white"
              : "bg-transparent text-[#6b6880] hover:text-[#9b8ec4]"
            }`}>
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-all cursor-pointer border-none flex items-center gap-2 ${
              billing === "yearly" ?
                "bg-violet-700 text-white"
              : "bg-transparent text-[#6b6880] hover:text-[#9b8ec4]"
            }`}>
            Yearly
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                billing === "yearly" ?
                  "bg-violet-500 text-white"
                : "bg-emerald-950/60 border border-emerald-900/60 text-emerald-400"
              }`}>
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 px-4 py-3 bg-emerald-950/50 border border-emerald-800/50 rounded-xl text-emerald-400 text-[13px] text-center">
          {successMsg}
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        {PLANS.map((plan) => {
          const { cta, ctaDisabled } = getCtaState(
            plan.id,
            user.membershipType,
          );
          const isCurrentPlan = plan.id === userPlan;
          const isHighlighted =
            userPlan === "FREE" ? plan.id === "PRO" : isCurrentPlan;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl flex flex-col transition-all duration-200 ${
                isHighlighted ?
                  plan.id === "ELITE" ?
                    "bg-[#13121c] border-2 border-amber-500 shadow-lg shadow-amber-950/40"
                  : "bg-[#13121c] border-2 border-violet-600 shadow-lg shadow-violet-950/40"
                : "bg-[#13121c] border border-[#1e1d28] hover:border-[#2d2b40]"
              }`}>
              {/* Popular badge */}
              {userPlan === "FREE" && plan.id === "PRO" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-violet-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`text-[11px] font-semibold px-3 py-1 rounded-full text-white ${
                      userPlan === "ELITE" ? "bg-amber-500" : "bg-violet-600"
                    }`}>
                    ✓ Current plan
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Plan header */}
                <div className="mb-6">
                  <h2 className="font-['Outfit'] font-bold text-[18px] text-white mb-1">
                    {plan.name}
                  </h2>
                  <p className="text-[12px] text-[#6b6880] mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    {plan.price[billing] === 0 ?
                      <span className="font-['Outfit'] font-extrabold text-[36px] text-white tracking-tight">
                        Free
                      </span>
                    : <>
                        <span className="font-['Outfit'] font-extrabold text-[36px] text-white tracking-tight">
                          ₹{plan.price[billing]}
                        </span>
                        <span className="text-[13px] text-[#4a4760]">
                          {billing === "monthly" ? "/mo" : "/year"}
                        </span>
                      </>
                    }
                  </div>
                  {billing === "yearly" && plan.price.yearly > 0 && (
                    <p className="text-[11px] text-emerald-400 mt-1">
                      ₹{plan.price.yearly}/year
                    </p>
                  )}

                  {plan.id === user.membershipType && user.membershipExpiry && (
                    <p className="text-[11px] text-[#6b6880] mt-1">
                      Active until{" "}
                      {new Date(user.membershipExpiry).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  )}
                </div>

                {/* CTA */}
                <button
                  disabled={ctaDisabled}
                  onClick={() => !ctaDisabled && handleBuyClick(plan)}
                  className={`w-full py-2.5 rounded-xl text-[13px] font-medium transition-all mb-6 ${
                    ctaDisabled ?
                      "bg-[#1a1928] border border-[#2d2b40] text-[#4a4760] cursor-default"
                    : isHighlighted ?
                      "bg-violet-700 hover:bg-violet-600 text-white cursor-pointer border-none"
                    : "bg-transparent border border-[#2d2b40] text-[#9b8ec4] hover:border-violet-700 hover:text-violet-300 cursor-pointer"
                  }`}>
                  {cta}
                </button>

                {/* Divider */}
                <div className="border-t border-[#1e1d28] mb-5" />

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckIcon filled={feature.included} />
                      <span
                        className={`text-[13px] ${feature.included ? "text-[#9b8ec4]" : "text-[#3a3850]"}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Perks section */}
      {userPlan !== "ELITE" && (
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-['Outfit'] font-extrabold text-[24px] text-white tracking-tight mb-2">
              Why go premium?
            </h2>
            <p className="text-[14px] text-[#6b6880]">
              Features that actually move the needle
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PERKS.map((perk) => (
              <div
                key={perk.title}
                className="flex items-start gap-4 bg-[#13121c] border border-[#1e1d28] rounded-xl p-5 hover:border-[#2d2b40] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#1a1928] border border-[#2d2b40] flex items-center justify-center text-violet-500 flex-shrink-0">
                  {perk.icon}
                </div>
                <div>
                  <h3 className="font-['Outfit'] font-bold text-[14px] text-white mb-1">
                    {perk.title}
                  </h3>
                  <p className="text-[13px] text-[#6b6880] leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="font-['Outfit'] font-extrabold text-[22px] text-white tracking-tight mb-6 text-center">
          Common questions
        </h2>
        <div className="flex flex-col gap-3">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes. Cancel your subscription at any time from your account settings. You keep access until the end of your billing period.",
            },
            {
              q: "Is there a free trial?",
              a: "The free plan gives you a solid taste of DevLink. Pro and Elite plans don't have a trial, but you can cancel within 7 days for a full refund.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit and debit cards via Razorpay. Your payment info is never stored on our servers.",
            },
            {
              q: "Can I switch plans?",
              a: "Yes, upgrade or downgrade anytime. Upgrades take effect immediately. Downgrades take effect at the next billing cycle.",
            },
          ].map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      {userPlan === "FREE" && (
        <div className="relative mt-16 bg-[#13121c] border border-[#2d2b40] rounded-2xl px-8 py-12 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(109,40,217,0.1),transparent_70%)]" />
          <h2 className="relative font-['Outfit'] font-extrabold text-[24px] text-white tracking-tight mb-3">
            Ready to find your coding partner?
          </h2>
          <p className="relative text-[14px] text-[#6b6880] mb-6">
            Join developers already using DevLink Pro to build faster, together.
          </p>
          <button
            onClick={() => handleBuyClick(PLANS[1])}
            className="relative px-8 py-3 bg-violet-700 hover:bg-violet-600 text-white text-[14px] font-medium rounded-xl transition-all cursor-pointer border-none">
            Start with Pro →
          </button>
        </div>
      )}
      {userPlan === "PRO" && (
        <div className="relative mt-16 bg-[#13121c] border border-[#2d2b40] rounded-2xl px-8 py-12 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(251,191,36,0.07),transparent_70%)]" />
          <h2 className="relative font-['Outfit'] font-extrabold text-[24px] text-white tracking-tight mb-3">
            You're on Pro. Go further with Elite.
          </h2>
          <p className="relative text-[14px] text-[#6b6880] mb-6">
            Get priority in feed, weekly profile boosts, and a verified badge.
          </p>
          <button
            onClick={() => handleBuyClick(PLANS[2])}
            className="relative px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black text-[14px] font-semibold rounded-xl transition-all cursor-pointer border-none">
            Upgrade to Elite →
          </button>
        </div>
      )}

      {userPlan === "ELITE" && (
        <div className="relative mt-16 bg-[#13121c] border border-amber-500/30 rounded-2xl px-8 py-12 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(251,191,36,0.07),transparent_70%)]" />
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-3.5 py-1.5 text-[11px] text-amber-400 uppercase tracking-widest font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Elite Member
          </div>
          <h2 className="relative font-['Outfit'] font-extrabold text-[24px] text-white tracking-tight mb-3">
            You're at the top. 🎉
          </h2>
          <p className="relative text-[14px] text-[#6b6880]">
            You have access to every feature DevLink has to offer.
            {user.membershipExpiry && (
              <span className="block mt-1 text-[13px] text-amber-400/70">
                Active until{" "}
                {new Date(user.membershipExpiry).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

// Accordion FAQ item
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`bg-[#13121c] border rounded-xl overflow-hidden transition-all ${
        open ? "border-[#2d2b40]" : "border-[#1e1d28]"
      }`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer bg-transparent border-none">
        <span className="font-['Outfit'] font-medium text-[14px] text-white">
          {q}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-[#4a4760] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-[13px] text-[#6b6880] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default Premium;
