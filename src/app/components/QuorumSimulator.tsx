import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Scale, Info } from 'lucide-react';

type AssemblyType = 'constitutive' | 'ago' | 'age' | 'special';
type Convocation = 'c1' | 'c2' | 'c3';

function parseNumber(v: string): number {
  return Math.max(0, parseFloat(v.replace(/\s/g, '').replace(',', '.')) || 0);
}

export function QuorumSimulator() {
  const { t } = useTranslation();
  const [assemblyType, setAssemblyType] = useState<AssemblyType>('constitutive');
  const [convocation, setConvocation] = useState<Convocation>('c1');
  const [specialDecision, setSpecialDecision] = useState(false);
  const [totalShares, setTotalShares] = useState('');
  const [presentShares, setPresentShares] = useState('');
  const [votesFor, setVotesFor] = useState('');
  const [hasCalculated, setHasCalculated] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const total = parseNumber(totalShares);
  const present = parseNumber(presentShares);
  const votes = parseNumber(votesFor);

  const getQuorumFraction = (): number => {
    if (assemblyType === 'ago') {
      if (convocation === 'c1') return 1 / 4;
      return 0;
    }
    if (convocation === 'c1') return 1 / 2;
    return 1 / 4;
  };

  const getMajorityType = (): 'unanimity' | 'twoThirds' | 'simple' => {
    if (assemblyType === 'constitutive' && specialDecision) return 'unanimity';
    if (assemblyType === 'ago') return 'simple';
    return 'twoThirds';
  };

  const quorumFraction = getQuorumFraction();
  const majorityType = getMajorityType();

  const requiredQuorumShares = quorumFraction * total;
  const quorumReached = quorumFraction === 0 ? true : present >= requiredQuorumShares && present > 0;

  const requiredMajorityVotes =
    majorityType === 'unanimity'
      ? present
      : majorityType === 'twoThirds'
        ? (2 / 3) * present
        : (present / 2) + 0.0001;
  const majorityReached = present > 0 && votes >= requiredMajorityVotes;

  const handleCalculate = () => {
    setHasCalculated(true);
    window.setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const disabled = !total || !present || !votes;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Scale className="text-[#0A2F73]" size={26} />
          <h3 className="text-xl md:text-2xl font-black text-[#0A2F73]">
            {t('quorum.title')}
          </h3>
        </div>

        <p className="text-xs text-gray-500 flex items-start gap-2">
          <Info size={14} className="mt-0.5 text-[#0A2F73]" />
          <span>{t('quorum.hint')}</span>
        </p>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                {t('quorum.assemblyType')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['constitutive', 'ago', 'age', 'special'] as AssemblyType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAssemblyType(type)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      assemblyType === type
                        ? 'bg-[#0A2F73] text-white border-[#0A2F73]'
                        : 'bg-slate-50 text-[#0A2F73] border-slate-200 hover:border-[#0A2F73]/40'
                    }`}
                  >
                    {t(`quorum.assembly.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                {t('quorum.convocation')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['c1', 'c2', 'c3'] as Convocation[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setConvocation(c)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      convocation === c
                        ? 'bg-[#0A2F73] text-white border-[#0A2F73]'
                        : 'bg-slate-50 text-[#0A2F73] border-slate-200 hover:border-[#0A2F73]/40'
                    }`}
                  >
                    {t(`quorum.convocations.${c}`)}
                  </button>
                ))}
              </div>
            </div>

            {assemblyType === 'constitutive' && (
              <label className="flex items-center gap-2 text-xs font-medium text-[#0A2F73] mt-2">
                <input
                  type="checkbox"
                  checked={specialDecision}
                  onChange={(e) => setSpecialDecision(e.target.checked)}
                  className="rounded border-gray-300 text-[#0A2F73] focus:ring-[#0A2F73]"
                />
                {t('quorum.specialDecision')}
              </label>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                {t('quorum.totalShares')}
              </label>
              <input
                type="number"
                min={0}
                value={totalShares}
                onChange={(e) => { setTotalShares(e.target.value); setHasCalculated(false); }}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-3 rounded-2xl font-bold outline-none transition-all"
                placeholder={t('quorum.placeholderTotal')}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                {t('quorum.presentShares')}
              </label>
              <input
                type="number"
                min={0}
                value={presentShares}
                onChange={(e) => { setPresentShares(e.target.value); setHasCalculated(false); }}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-3 rounded-2xl font-bold outline-none transition-all"
                placeholder={t('quorum.placeholderPresent')}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">
                {t('quorum.votesFor')}
              </label>
              <input
                type="number"
                min={0}
                value={votesFor}
                onChange={(e) => { setVotesFor(e.target.value); setHasCalculated(false); }}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-[#0A2F73] p-3 rounded-2xl font-bold outline-none transition-all"
                placeholder={t('quorum.placeholderVotes')}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          disabled={disabled}
          className="w-full mt-2 px-5 py-4 rounded-2xl bg-[#0A2F73] text-white font-black text-sm hover:bg-[#E64501] transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('quorum.calc')}
        </button>
      </div>

      {hasCalculated && (
        <motion.div
          ref={resultRef}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid md:grid-cols-2 gap-4"
        >
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0A2F73]">
              {t('quorum.quorumTitle')}
            </h4>
            {quorumFraction === 0 ? (
              <p className="text-sm text-gray-700">
                {t('quorum.noQuorumRule')}
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-700">
                  {t('quorum.quorumRule', { percent: Math.round(quorumFraction * 100) })}
                </p>
                <p className="text-sm">
                  {t('quorum.quorumDetail', {
                    required: Math.ceil(requiredQuorumShares),
                    present,
                  })}
                </p>
              </>
            )}
            <p className={`text-sm font-bold ${quorumReached ? 'text-emerald-600' : 'text-red-600'}`}>
              {quorumReached ? t('quorum.quorumOk') : t('quorum.quorumFail')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#0A2F73]">
              {t('quorum.majorityTitle')}
            </h4>
            <p className="text-sm text-gray-700">
              {majorityType === 'unanimity'
                ? t('quorum.majorityUnanimity')
                : majorityType === 'twoThirds'
                  ? t('quorum.majorityTwoThirds')
                  : t('quorum.majoritySimple')}
            </p>
            <p className="text-sm">
              {t('quorum.majorityDetail', {
                required: Math.ceil(requiredMajorityVotes),
                votes,
              })}
            </p>
            <p className={`text-sm font-bold ${majorityReached ? 'text-emerald-600' : 'text-red-600'}`}>
              {majorityReached ? t('quorum.majorityOk') : t('quorum.majorityFail')}
            </p>
          </div>

          <div className="md:col-span-2 bg-[#0A2F73] text-white rounded-2xl shadow-lg p-5 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-white/70">
              {t('quorum.summaryTitle')}
            </h4>
            <p className="text-sm">
              {!quorumReached
                ? t('quorum.summaryNoQuorum')
                : majorityReached
                  ? t('quorum.summaryAllOk')
                  : t('quorum.summaryNoMajority')}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

