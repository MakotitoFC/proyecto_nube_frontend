import React, { useState } from 'react';
import { IconMail, IconArrowRight } from '@tabler/icons-react';
import { motion, Variants } from 'framer-motion';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BACK_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail('');
      } else {
        const data = await response.json();
        setError(data.message || 'Error al suscribirse');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setError('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <section className="relative py-32 bg-[#fcfaf7] overflow-hidden min-h-[60vh] flex items-center">
      {/* Background Image - Light/Clean */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1545652516-a3ec3b4823db?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="White Texture"
          className="w-full h-full object-cover opacity-80 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#fcfaf7] via-[#fcfaf7]/90 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center lg:text-left space-y-8"
          >
            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-900/5 border border-slate-900/10 rounded-full w-fit backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-[#09C9CB]"></span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-principal font-bold">CLIENTE EXCLUSIVO</span>
              </div>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-principal font-extrabold text-slate-900 leading-tight">
              Únete al <br />
              <span className="font-secundaria  opacity-90 text-6xl md:text-8xl ml-2">Privilegio.</span>
            </motion.h2>

            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start">
              <p className="text-slate-500 uppercase font-semibold text-sm leading-8 max-w-md font-principal tracking-wide pt-6 lg:pt-0 lg:pl-6">
                SÉ EL PRIMERO EN RECIBIR INVITACIONES EXCLUSIVAS A NUESTROS
                EVENTOS Y EXPERIENCIAS DE TEMPORADA, DISEÑADAS PARA RECONECTAR.              </p>
            </motion.div>
          </motion.div>

          {/* Form Card - Light Glass */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative group overflow-hidden"
          >
            {/* Decorative Shine (Light) */}
            <div className="absolute -top-full -left-full w-[200%] h-[200%] bg-linear-to-br from-white/40 via-transparent to-transparent group-hover:translate-x-[50%] group-hover:translate-y-[50%] transition-transform duration-1000"></div>

            {isSuccess ? (
              <div className="text-center py-12 space-y-4 relative z-10">
                <div className="w-16 h-16 bg-[#09C9CB]/10 text-[#09C9CB] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Registro Actualizado</h3>
                <p className="text-slate-500 font-medium text-sm">¡Gracias por unirte! Pronto recibirás nuestras novedades exclusivas.</p>
                <button 
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="text-[10px] cursor-pointer font-bold text-[#09C9CB] uppercase tracking-widest mt-6 px-5 py-2.5 bg-[#09C9CB]/5 border border-[#09C9CB]/10 rounded-full hover:bg-[#09C9CB]/10 transition-all"
                >
                  Suscribir otro correo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-slate-500 font-principal font-bold ml-1 mb-2">Newsletter</label>
                  <div className="relative">
                    <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" stroke={1.5} size={20} />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full bg-white border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 outline-none  focus:ring-1  transition-all font-principal font-medium shadow-sm"
                    />
                  </div>
                  {error && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-wider">{error}</p>}
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-principal font-bold uppercase tracking-widest text-xs  transition-all flex items-center justify-center gap-2 group-btn shadow-lg shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'Suscribiendo...' : 'Suscribirse Ahora'}</span>
                  {!isSubmitting && <IconArrowRight size={16} className="group-btn-hover:translate-x-1 transition-transform" />}
                </button>

              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};