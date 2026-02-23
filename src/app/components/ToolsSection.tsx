import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Wallet } from 'lucide-react';
import { TaxCalculator } from '@/app/components/TaxCalculator';
import { SalarySimulator } from '@/app/components/SalarySimulator';

export function ToolsSection() {
  const [activeTool, setActiveTool] = useState<'tax' | 'salary'>('tax');

  return (
    <section id="tools" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 text-[#0A2F73]">
            Outils de Simulation
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estimez vos impôts et simulez votre salaire gratuitement
          </p>
        </motion.div>

        {/* Tool Selector */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <motion.button
            onClick={() => setActiveTool('tax')}
            className={`flex items-center gap-3 px-8 py-4 rounded-lg transition-all ${
              activeTool === 'tax'
                ? 'bg-[#0A2F73] text-white shadow-lg'
                : 'bg-white text-[#0A2F73] border-2 border-[#0A2F73] hover:bg-[#0A2F73] hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calculator size={24} />
            <span>Calculateur d'Impôts</span>
          </motion.button>

          <motion.button
            onClick={() => setActiveTool('salary')}
            className={`flex items-center gap-3 px-8 py-4 rounded-lg transition-all ${
              activeTool === 'salary'
                ? 'bg-[#0A2F73] text-white shadow-lg'
                : 'bg-white text-[#0A2F73] border-2 border-[#0A2F73] hover:bg-[#0A2F73] hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet size={24} />
            <span>Simulateur de Paie</span>
          </motion.button>
        </div>

        {/* Tool Content */}
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTool === 'tax' ? <TaxCalculator /> : <SalarySimulator />}
        </motion.div>
      </div>
    </section>
  );
}
