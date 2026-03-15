import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateMessage } from "@/hooks/use-messages";
import { Loader2, Send, Brain, Vote, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { t } = useTranslation();
  const { mutate, isPending } = useCreateMessage();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactForm) => {
    mutate(data, { onSuccess: () => reset() });
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-white font-display" data-testid="text-contact-title">
              {t("contact.title", "Join the")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">{t("contact.titleHighlight", "Autonomous")}</span> {t("contact.titleEnd", "Future")}
            </h2>
            <p className="text-slate-400 text-lg">
              {t("contact.subtitle", "Get in touch to participate in the Aidag Chain ecosystem, establish partnerships, or learn technical details.")}
            </p>
            <div className="space-y-4 mt-8">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-emerald-900/20 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t("contact.soulwareTech", "SoulwareAI Technology")}</h3>
                    <p className="text-slate-400 text-sm">{t("contact.soulwareTechDesc", "Technical details and integration information about our modular AI engine.")}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Vote className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t("contact.daoGov", "DAO Governance")}</h3>
                    <p className="text-slate-400 text-sm">{t("contact.daoGovDesc", "DAO governance mechanism, voting processes, and community participation.")}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/20 to-purple-900/20 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{t("contact.quantumSec", "Quantum Security")}</h3>
                    <p className="text-slate-400 text-sm">{t("contact.quantumSecDesc", "Our post-quantum security infrastructure and multi-chain ecosystem integrations.")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="glass-card p-8 rounded-3xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-testid="form-contact">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">{t("contact.name", "Name")}</label>
                  <input {...register("name")} data-testid="input-name"
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder={t("contact.namePlaceholder", "Your name")} />
                  {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">{t("contact.email", "Email")}</label>
                  <input {...register("email")} data-testid="input-email"
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder={t("contact.emailPlaceholder", "you@example.com")} />
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">{t("contact.subject", "Subject")}</label>
                <input {...register("subject")} data-testid="input-subject"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder={t("contact.subjectPlaceholder", "Partnership / Technical / DAO Proposal")} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">{t("contact.message", "Message")}</label>
                <textarea {...register("message")} rows={4} data-testid="input-message"
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                  placeholder={t("contact.messagePlaceholder", "Tell us about your interest in Aidag Chain...")} />
                {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
              </div>
              <button type="submit" disabled={isPending} data-testid="button-send-message"
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {t("contact.send", "Send Message")}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
