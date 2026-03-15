import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSubscriber } from "@/hooks/use-subscribers";
import { Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export default function Newsletter() {
  const { t } = useTranslation();
  const { mutate, isPending } = useCreateSubscriber();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = (data: NewsletterForm) => {
    mutate(data, { onSuccess: () => reset() });
  };

  return (
    <section id="community" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-12 text-center border border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
            {t("newsletter.title", "Join the")} <span className="text-cyan-400">{t("newsletter.titleHighlight", "Revolution")}</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            {t("newsletter.subtitle", "Stay updated with the latest network developments, partnerships, and mainnet launch dates. No spam, just tech.")}
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto flex flex-col gap-4">
            <div className="relative">
              <input {...register("email")} placeholder={t("newsletter.placeholder", "Enter your email address")}
                className="w-full px-6 py-4 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                disabled={isPending} data-testid="input-newsletter-email" />
              {errors.email && <span className="absolute -bottom-6 left-0 text-xs text-red-400">{errors.email.message}</span>}
            </div>
            <button type="submit" disabled={isPending} data-testid="button-subscribe"
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isPending ? (<><Loader2 className="w-5 h-5 animate-spin" /> {t("newsletter.subscribing", "Subscribing...")}</>) : t("newsletter.subscribe", "Subscribe Now")}
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-6">{t("newsletter.privacy", "By subscribing, you agree to our Privacy Policy and Terms of Service.")}</p>
        </motion.div>
      </div>
    </section>
  );
}
