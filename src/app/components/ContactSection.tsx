import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-[#0A2F73] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4">
            Contactez-nous
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Nous sommes à votre écoute pour répondre à toutes vos questions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl mb-8">Informations de Contact</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#3F5F99] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="mb-1">Adresse</h4>
                  <p className="text-gray-300">Allées Therno Seydou Nourou TALL<br />Villa n° 4267 Point E, Dakar 16600, Sénégal</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#3F5F99] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="mb-1">Téléphone</h4>
                  <p className="text-gray-300">+221 33 859 09 49</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#3F5F99] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="mb-1">Email</h4>
                  <p className="text-gray-300">contact@adoc-audit.fr</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#3F5F99] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="mb-1">Horaires</h4>
                  <p className="text-gray-300">Lundi - Vendredi : 8h30 - 18h00</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="name" className="block mb-2">Nom complet</label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 focus:border-[#3F5F99] focus:outline-none focus:ring-2 focus:ring-[#3F5F99]/50 transition-all"
                placeholder="Votre nom"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 focus:border-[#3F5F99] focus:outline-none focus:ring-2 focus:ring-[#3F5F99]/50 transition-all"
                placeholder="votre.email@exemple.fr"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block mb-2">Sujet</label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 focus:border-[#3F5F99] focus:outline-none focus:ring-2 focus:ring-[#3F5F99]/50 transition-all"
                placeholder="Objet de votre demande"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block mb-2">Message</label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 focus:border-[#3F5F99] focus:outline-none focus:ring-2 focus:ring-[#3F5F99]/50 transition-all resize-none"
                placeholder="Votre message"
              ></textarea>
            </div>
            
            <motion.button
              type="submit"
              className="w-full bg-[#3F5F99] text-white px-8 py-4 rounded-md hover:bg-[#BF0001] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Envoyer le message
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
