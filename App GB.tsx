import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  UserRound,
  TrendingUp,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type Option = { label: string; score: number };
type Question = { id: string; title: string; options?: Option[]; type?: 'currency'; placeholder?: string; showChart?: boolean };
type AnswerMap = Record<string, Option | undefined>;
type ProfileKey = 'muy-conservador' | 'conservador' | 'equilibrado' | 'agresivo';

type PortfolioConfig = {
  objetivo: string;
  retornoPromedio: number;
  mejorEscenario: number;
  maxRiesgoAnual: number;
  horizonte: string;
  acciones: string;
  bonos: string;
  efectivo: string;
  subclases: Array<[string, string]>;
};

type ProfileDefinition = {
  key: ProfileKey;
  label: string;
  min: number;
  max: number;
  projectionLabel: string;
  description: string;
  recommendation: string;
};

const portfolioQuestionChartData = [
  { year: 'Año 1', A: 3.0, B: 6.0, C: 15.0, D: 21.0, E: 27.0 },
  { year: 'Año 2', A: 3.0, B: -2.0, C: -5.0, D: -9.0, E: -12.0 },
  { year: 'Año 3', A: 3.0, B: 5.0, C: -3.0, D: -5.0, E: -10.0 },
  { year: 'Año 4', A: 3.0, B: 6.0, C: 10.0, D: 17.0, E: 30.0 },
  { year: 'Año 5', A: 3.0, B: 4.5, C: 9.0, D: 9.0, E: 7.0 },
];

const portfolioDescriptions: Record<string, string> = {
  'Portfolio A': 'Año 1: 3.0% · Año 2: 3.0% · Año 3: 3.0% · Año 4: 3.0% · Año 5: 3.0%',
  'Portfolio B': 'Año 1: 6.0% · Año 2: -2.0% · Año 3: 5.0% · Año 4: 6.0% · Año 5: 4.5%',
  'Portfolio C': 'Año 1: 15.0% · Año 2: -5.0% · Año 3: -3.0% · Año 4: 10.0% · Año 5: 9.0%',
  'Portfolio D': 'Año 1: 21.0% · Año 2: -9.0% · Año 3: -5.0% · Año 4: 17.0% · Año 5: 9.0%',
  'Portfolio E': 'Año 1: 27.0% · Año 2: -12.0% · Año 3: -10.0% · Año 4: 30.0% · Año 5: 7.0%',
};

const profileData: Record<'conservador' | 'equilibrado' | 'agresivo', PortfolioConfig> = {
  conservador: {
    objetivo: 'Preservación de capital',
    retornoPromedio: 6.0,
    mejorEscenario: 7.0,
    maxRiesgoAnual: 2.0,
    horizonte: '1-3 años',
    acciones: '0%',
    bonos: '90%',
    efectivo: '10%',
    subclases: [
      ['Bonos Corporativos USA', '40%'],
      ['Bonos del Tesoro', '30%'],
      ['Certificado Depósito', '15%'],
      ['Bonos Municipales', '5%'],
      ['Money Market', '10%'],
    ],
  },
  equilibrado: {
    objetivo: 'Apreciación de capital',
    retornoPromedio: 14.0,
    mejorEscenario: 22.9,
    maxRiesgoAnual: 12.0,
    horizonte: '3-5 años',
    acciones: '60%',
    bonos: '35%',
    efectivo: '5%',
    subclases: [
      ['Mega Cap +200BLN', '30%'],
      ['Large Cap +10BLN', '15%'],
      ['ETFs', '15%'],
      ['Bonos Americanos', '20%'],
      ['Bonos del Tesoro', '15%'],
      ['Money Market', '5%'],
    ],
  },
  agresivo: {
    objetivo: 'Apreciación de capital',
    retornoPromedio: 18.0,
    mejorEscenario: 31.0,
    maxRiesgoAnual: 25.0,
    horizonte: '3-5 años',
    acciones: '90%',
    bonos: '5%',
    efectivo: '5%',
    subclases: [
      ['Mega Cap +200BLN', '30%'],
      ['Large Cap +10BLN', '25%'],
      ['ETFs', '20%'],
      ['Mid Cap', '15%'],
      ['Bonos Americanos', '5%'],
      ['Money Market', '5%'],
    ],
  },
};

const surveyConfig: { brand: string; subtitle: string; profiles: ProfileDefinition[]; questions: Question[] } = {
  brand: 'Guardian Brothers Wealth Management',
  subtitle: '',
  profiles: [
    {
      key: 'muy-conservador',
      label: 'Muy conservador',
      min: 10,
      max: 11,
      projectionLabel: 'Muy limitada para bolsa',
      description: 'Este perfil prioriza fuertemente la seguridad y la preservación del capital. La volatilidad natural del mercado podría no alinearse con su nivel de comodidad actual.',
      recommendation: 'Por ahora, la bolsa probablemente no es lo suyo. Lo ideal sería evaluar primero alternativas mucho más defensivas y una estrategia de entrada gradual.',
    },
    {
      key: 'conservador',
      label: 'Conservador',
      min: 12,
      max: 23,
      projectionLabel: '8% - 12% anual',
      description: 'Busca estabilidad, menor volatilidad y preservar el capital por encima de maximizar retornos.',
      recommendation: 'Una cartera enfocada en instrumentos más estables y una exposición moderada al crecimiento.',
    },
    {
      key: 'equilibrado',
      label: 'Equilibrado',
      min: 24,
      max: 35,
      projectionLabel: '13% - 18% anual',
      description: 'Busca balance entre crecimiento y seguridad, aceptando fluctuaciones moderadas a cambio de mejores retornos.',
      recommendation: 'Una cartera diversificada con balance entre crecimiento, estabilidad y oportunidades de largo plazo.',
    },
    {
      key: 'agresivo',
      label: 'Agresivo',
      min: 36,
      max: 46,
      projectionLabel: '19% - 25% anual',
      description: 'Prioriza el crecimiento del capital y tolera variaciones importantes en el corto plazo.',
      recommendation: 'Una cartera orientada al crecimiento con mayor exposición a activos de mayor volatilidad.',
    },
  ],
  questions: [
    {
      id: 'q1',
      title: '1. ¿Qué respuesta describe mejor su conocimiento de inversión?',
      options: [
        { label: 'Novato', score: 1 },
        { label: 'Principiante', score: 2 },
        { label: 'Bueno', score: 3 },
        { label: 'Muy Bueno', score: 4 },
        { label: 'Profesional', score: 5 },
      ],
    },
    {
      id: 'q2',
      title: '2. ¿Cuándo necesitará acceder a esta cartera de inversiones, ya sea por medio de retiros regulares o una gran suma global?',
      options: [
        { label: 'Menos de un año', score: 1 },
        { label: '1 - 5 años', score: 1 },
        { label: '5 - 10 años', score: 1 },
        { label: '10 años o más', score: 1 },
      ],
    },
    {
      id: 'q3',
      title: '3. Elija la declaración que mejor describa el propósito principal de esta cartera.',
      options: [
        { label: 'Seguridad', score: 2 },
        { label: 'Protección contra la inflación', score: 4 },
        { label: 'Crecimiento y seguridad', score: 5 },
        { label: 'Crecimiento', score: 6 },
        { label: 'Crecimiento máximo', score: 7 },
      ],
    },
    {
      id: 'q4',
      title: '4. ¿Cuál es su ingreso mensual?',
      options: [
        { label: 'Menos de $1,000', score: 1 },
        { label: '$1,000 a $5,000', score: 2 },
        { label: '$5,000 a $10,000', score: 3 },
        { label: '$10,000 a $15,000', score: 4 },
        { label: 'Más de $15,000', score: 5 },
      ],
    },
    {
      id: 'q5',
      title: '5. ¿Qué opción describe mejor su situación financiera personal o familiar?',
      options: [
        { label: 'Actualmente no puedo cumplir con todas mis obligaciones financieras sin aumentar mi deuda.', score: 1 },
        { label: 'Puedo cumplir con todas mis obligaciones financieras, pero tengo poco o ningún ahorro.', score: 2 },
        { label: 'Puedo cumplir con todas mis obligaciones financieras y puedo ahorrar menos del 10% de mis ingresos.', score: 3 },
        { label: 'Puedo cumplir con todas mis obligaciones financieras y puedo ahorrar un 10% o más de mis ingresos.', score: 4 },
        { label: 'Tengo pocas obligaciones financieras y una gran cantidad de ahorros.', score: 5 },
      ],
    },
    {
      id: 'q6',
      title: '6. Si fuera propietario de una inversión que cayó 2% en un periodo de un año, ¿qué haría?',
      options: [
        { label: 'Vendería mi inversión a pesar de que conduciría a una pérdida inmediata.', score: 1 },
        { label: 'Esperaría hasta que vuelva a su valor original y luego la movería a algo menos volátil.', score: 2 },
        { label: 'Esperaría porque las fluctuaciones del mercado son normales.', score: 4 },
        { label: 'Compraría más de esta acción porque está a buen precio y voy a largo plazo.', score: 5 },
        { label: 'Aprovecharía la caída para aumentar significativamente mi posición buscando mayor rendimiento futuro.', score: 6 },
      ],
    },
    {
      id: 'q7',
      title: '7. Si tuviera $20,000 para invertir, ¿con qué opción se sentiría más cómodo?',
      options: [
        { label: 'Mínimo $20,000 - Máximo $20,600', score: 1 },
        { label: 'Mínimo $19,000 - Máximo $21,600', score: 2 },
        { label: 'Mínimo $18,000 - Máximo $23,000', score: 3 },
        { label: 'Mínimo $17,000 - Máximo $24,000', score: 4 },
        { label: 'Mínimo $15,000 - Máximo $26,000', score: 5 },
      ],
    },
    {
      id: 'q8',
      title: '8. ¿Con cuál de las siguientes cinco carteras hipotéticas te sentirías más cómodo?',
      showChart: true,
      options: [
        { label: 'Portfolio A', score: 1 },
        { label: 'Portfolio B', score: 2 },
        { label: 'Portfolio C', score: 3 },
        { label: 'Portfolio D', score: 4 },
        { label: 'Portfolio E', score: 5 },
      ],
    },
    {
      id: 'q9',
      title: '9. Dadas las fluctuaciones de cualquier cartera, ¿cuánto tiempo estaría dispuesto a esperar a que sus inversiones recuperen cualquier valor perdido?',
      options: [
        { label: 'Menos de tres meses', score: 1 },
        { label: 'Tres a seis meses', score: 2 },
        { label: 'Seis meses a un año', score: 3 },
        { label: 'Un año a dos', score: 4 },
        { label: 'Dos a tres años', score: 5 },
      ],
    },
    { id: 'amount', title: '¿Cuánto va a invertir?', type: 'currency', placeholder: 'Ej. 100000' },
  ],
};

function getProfile(total: number) {
  return surveyConfig.profiles.find((profile) => total >= profile.min && total <= profile.max) ?? surveyConfig.profiles[2];
}

function getProfileSummaryText(profileKey: ProfileKey) {
  switch (profileKey) {
    case 'muy-conservador':
      return 'El perfil muy conservador prioriza la preservación del capital y busca evitar volatilidad. Recomendamos instrumentos de bajo riesgo y plazos cortos.';
    case 'conservador':
      return 'El perfil conservador busca seguridad con rendimientos moderados. Ideal para personas que desean estabilidad con algo de crecimiento.';
    case 'equilibrado':
      return 'El perfil equilibrado busca un balance entre crecimiento y protección. Acepta fluctuaciones moderadas para retornos más sólidos en el largo plazo.';
    case 'agresivo':
      return 'El perfil agresivo prioriza el crecimiento y está dispuesto a asumir volatilidad. Recomendado para objetivos de largo plazo y alta tolerancia a riesgo.';
    default:
      return '';
  }
}

function formatCurrency(value: string | number) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function sanitizeDigits(value: string) {
  return value.replace(/\D/g, '');
}

function projectCompound(amount: number, annualRate: number, years: number) {
  return amount * Math.pow(1 + annualRate / 100, years);
}

function projectWorstCase(amount: number, annualRisk: number, years: number) {
  return amount * Math.pow(Math.max(0, 1 - annualRisk / 100), years);
}

function buildProjectionChart(amount: number, profileKey: 'conservador' | 'equilibrado' | 'agresivo') {
  const config = profileData[profileKey];
  return Array.from({ length: 6 }, (_, year) => ({
    year: `Año ${year}`,
    Promedio: year === 0 ? amount : projectCompound(amount, config.retornoPromedio, year),
    Mejor: year === 0 ? amount : projectCompound(amount, config.mejorEscenario, year),
    Peor: year === 0 ? amount : projectWorstCase(amount, config.maxRiesgoAnual, year),
  }));
}

function calculateProjection(amount: string, profileKey: ProfileKey) {
  const numericAmount = Number(amount || 0);
  if (!numericAmount || profileKey === 'muy-conservador') return null;
  const safeProfileKey = profileKey as 'conservador' | 'equilibrado' | 'agresivo';
  const config = profileData[safeProfileKey];
  const chart = buildProjectionChart(numericAmount, safeProfileKey);
  return {
    invested: numericAmount,
    year3Average: projectCompound(numericAmount, config.retornoPromedio, 3),
    year5Average: projectCompound(numericAmount, config.retornoPromedio, 5),
    year3Best: projectCompound(numericAmount, config.mejorEscenario, 3),
    year5Best: projectCompound(numericAmount, config.mejorEscenario, 5),
    year5Worst: projectWorstCase(numericAmount, config.maxRiesgoAnual, 5),
    chart,
  };
}

function BrandHeader() {
  return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Open Sans, sans-serif' }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: '#0b1f44', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 18, fontFamily: 'Lora, serif' }}>
        GB
      </div>
      <div>
        <div style={{ fontWeight: 700, color: '#0b1f44', fontSize: 18, fontFamily: 'Lora, serif' }}>Guardian Brothers</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>Wealth Management</div>
      </div>
    </div>
  );
}

function ProfileBadge({ label }: { label: string }) {
  return <span style={{ background: '#f59e0b', color: '#0b1f44', padding: '4px 10px', borderRadius: 999, fontWeight: 600 }}>{label}</span>;
}

function App() {
  const [clientName, setClientName] = useState('');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [investmentAmount, setInvestmentAmount] = useState('');

  const totalQuestions = surveyConfig.questions.length;
  const isIntro = step === 0;
  const isResult = step === totalQuestions + 1;
  const currentQuestion = surveyConfig.questions[step - 1];

  const totalScore = useMemo(() => Object.values(answers).reduce((sum, value) => sum + (value?.score || 0), 0), [answers]);
  const profile = useMemo(() => getProfile(totalScore), [totalScore]);
  const allocation = profile.key === 'muy-conservador' ? null : profileData[profile.key as 'conservador' | 'equilibrado' | 'agresivo'];
  const projection = useMemo(() => calculateProjection(investmentAmount, profile.key), [investmentAmount, profile.key]);
  const progress = useMemo(() => {
    if (isIntro) return 0;
    if (isResult) return 100;
    return Math.round(((step - 1) / totalQuestions) * 100);
  }, [isIntro, isResult, step, totalQuestions]);

  const canContinueFromIntro = clientName.trim().length > 0;
  const hasSelectedCurrent = currentQuestion
    ? currentQuestion.type === 'currency'
      ? investmentAmount.trim().length > 0
      : Boolean(answers[currentQuestion.id])
    : false;

  const handleSelect = (questionId: string, option: Option) => setAnswers((prev) => ({ ...prev, [questionId]: option }));

  const adjustInvestment = (delta: number) => {
    const current = Number(investmentAmount || 0);
    const next = Math.max(0, Math.round(current + delta));
    setInvestmentAmount(next.toString());
  };

  const nextStep = () => {
    if (isIntro) {
      if (!canContinueFromIntro) return;
      setStep(1);
      return;
    }
    if (!isResult && step <= totalQuestions && hasSelectedCurrent) {
      setStep((prev) => (prev === totalQuestions ? totalQuestions + 1 : prev + 1));
    }
  };

  const prevStep = () => {
    if (isResult) { setStep(totalQuestions); return; }
    setStep((prev) => Math.max(0, prev - 1));
  };

  const resetAll = () => {
    setClientName('');
    setAnswers({});
    setInvestmentAmount('');
    setStep(0);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 16, fontFamily: 'Open Sans, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: 24, boxShadow: '0 4px 30px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0' }}>
            <BrandHeader />
            <h1 style={{ margin: '12px 0 4px', fontSize: 28, fontFamily: 'Lora, serif' }}>Perfil de Inversionista</h1>
            <p style={{ color: '#475569' }}>{surveyConfig.subtitle}</p>
            <div style={{ height: 8, width: '100%', background: '#e2e8f0', borderRadius: 999, marginTop: 12 }}>
              <div style={{ width: `${progress}%`, height: '100%', background: '#0f172a', borderRadius: 999 }} />
            </div>
          </div>

          <div style={{ padding: 20 }}>
            {isIntro && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ background: '#e2e8f0', borderRadius: 14, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <UserRound size={18} />
                    <strong>Datos del cliente</strong>
                  </div>
                  <label style={{ display: 'block', marginBottom: 6 }}>Nombre del cliente</label>
                  <input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid #cbd5e1', fontSize: 16 }}
                  />
                </div>
              </motion.div>
            )}

            {!isIntro && !isResult && currentQuestion && (
              <motion.div key={currentQuestion.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ color: '#64748b', fontSize: 13 }}>Pregunta {step} de {totalQuestions}</span>
                  <h2 style={{ marginTop: 8, fontSize: 22, fontFamily: 'Lora, serif' }}>{currentQuestion.title}</h2>
                </div>

                {currentQuestion.type === 'currency' ? (
                  <div style={{ background: '#f1f5f9', borderRadius: 14, padding: 14 }}>
                    <label style={{ fontWeight: 600 }}>Monto estimado en USD</label>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => adjustInvestment(100000)} style={{ border: '1px solid #0b1f44', borderRadius: 8, background: '#eab308', color: '#0b1f44', fontWeight: 700, padding: '6px 10px' }}>+100,000</button>
                      <button type="button" onClick={() => adjustInvestment(10000)} style={{ border: '1px solid #0b1f44', borderRadius: 8, background: '#0b1f44', color: '#eab308', fontWeight: 700, padding: '6px 10px' }}>+10,000</button>
                      <button type="button" onClick={() => adjustInvestment(5000)} style={{ border: '1px solid #0b1f44', borderRadius: 8, background: '#eab308', color: '#0b1f44', fontWeight: 700, padding: '6px 10px' }}>+5,000</button>
                      <button type="button" onClick={() => adjustInvestment(-5000)} style={{ border: '1px solid #0b1f44', borderRadius: 8, background: '#1f2937', color: '#eab308', fontWeight: 700, padding: '6px 10px' }}>-5,000</button>
                      <button type="button" onClick={() => adjustInvestment(-10000)} style={{ border: '1px solid #0b1f44', borderRadius: 8, background: '#eab308', color: '#0b1f44', fontWeight: 700, padding: '6px 10px' }}>-10,000</button>
                      <button type="button" onClick={() => adjustInvestment(-100000)} style={{ border: '1px solid #0b1f44', borderRadius: 8, background: '#0b1f44', color: '#eab308', fontWeight: 700, padding: '6px 10px' }}>-100,000</button>
                    </div>
                    <input
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(sanitizeDigits(e.target.value))}
                      placeholder={currentQuestion.placeholder}
                      style={{ width: '100%', marginTop: 8, padding: 10, borderRadius: 10, border: '1px solid #cbd5e1' }}
                    />
                    <div style={{ marginTop: 8, color: '#475569' }}>
                      Monto capturado: <strong>{investmentAmount ? formatCurrency(investmentAmount) : '$0'}</strong>
                    </div>
                  </div>
                ) : (
                  <>
                    {currentQuestion.showChart && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ marginBottom: 8 }}><strong>Comparativo de portfolios</strong></div>
                        <div style={{ width: '100%', height: 260, background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={portfolioQuestionChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis unit="%" />
                              <Tooltip formatter={(value: number) => [`${value}%`, 'Retorno']} />
                              <Legend layout="horizontal" align="left" verticalAlign="bottom" wrapperStyle={{ left: 0, bottom: -10 }} />
                              <Line type="monotone" dataKey="A" name="Portfolio A" stroke="#1e3a8a" dot={false} />
                              <Line type="monotone" dataKey="B" name="Portfolio B" stroke="#2563eb" dot={false} />
                              <Line type="monotone" dataKey="C" name="Portfolio C" stroke="#0f766e" dot={false} />
                              <Line type="monotone" dataKey="D" name="Portfolio D" stroke="#ca8a04" dot={false} />
                              <Line type="monotone" dataKey="E" name="Portfolio E" stroke="#b91c1c" dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginTop: 10 }}>
                          {Object.entries(portfolioDescriptions).map(([key, value]) => (
                            <div key={key} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}>
                              <strong>{key}</strong>
                              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#475569' }}>{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gap: 10 }}>
                      {currentQuestion.options?.map((option) => {
                        const selected = answers[currentQuestion.id]?.label === option.label;
                        return (
                          <button
                            key={option.label}
                            onClick={() => handleSelect(currentQuestion.id, option)}
                            style={{
                              borderRadius: 12,
                              border: selected ? '2px solid #1d4ed8' : '1px solid #cbd5e1',
                              background: selected ? '#1d4ed8' : '#fff',
                              color: selected ? 'white' : '#0f172a',
                              padding: 12,
                              textAlign: 'left',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                              <div>
                                <div style={{ fontSize: 14 }}>{option.label}</div>
                                {currentQuestion.id === 'q8' && portfolioDescriptions[option.label] && (
                                  <div style={{ marginTop: 4, fontSize: 12, color: selected ? '#e2e8f0' : '#64748b' }}>{portfolioDescriptions[option.label]}</div>
                                )}
                              </div>
                              {selected && <span style={{ fontWeight: 700 }}>✓</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {isResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ background: '#0f172a', color: 'white', borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={20} /> <h2 style={{ margin: 0, fontFamily: 'Lora, serif' }}>Perfil {profile.label}</h2></div>
                    <button onClick={printReport} style={{ border: 'none', borderRadius: 10, background: '#f59e0b', color: '#0f172a', fontWeight: 700, padding: '8px 12px', cursor: 'pointer' }}>Imprimir / PDF</button>
                  </div>
                  <p style={{ marginTop: 10 }}>¡Felicidades! Gracias por ayudarnos a completar tu perfil. Tu perfil es <strong>{profile.label}</strong>.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14, marginTop: 14 }}>
                  <div style={{ pageBreakAfter: 'always' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><strong>Perfil {clientName || 'Cliente'}</strong><ProfileBadge label={profile.label} /></div>
                        <div style={{ marginTop: 8 }}><strong>Proyección estimada</strong></div>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, marginTop: 6 }}><strong>Rango:</strong> {profile.projectionLabel}</div>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, marginTop: 6 }}><strong>Estrategia:</strong> {profile.recommendation}</div>
                      </div>

                      <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
                        <h3 style={{ margin: 0, fontFamily: 'Lora, serif' }}>Resumen</h3>
                        <div style={{ marginTop: 8 }}><div style={{ color: '#64748b' }}>Perfil detectado</div><div>{profile.label}</div></div>
                        <div style={{ marginTop: 8 }}><div style={{ color: '#64748b' }}>Descripción</div><div>{getProfileSummaryText(profile.key)}</div></div>
                        <div style={{ marginTop: 8 }}><div style={{ color: '#64748b' }}>Estrategia de inversión</div><div>{profile.recommendation}</div></div>
                      </div>
                    </div>
                  </div>

                  <div style={{ pageBreakBefore: 'always', marginTop: 20 }}>
                    <div style={{ marginBottom: 8 }}><BrandHeader /></div>
                    <div style={{ marginBottom: 8 }}><h2 style={{ margin: 0, fontFamily: 'Lora, serif', fontSize: 24, color: '#0f172a' }}>Perfil de inversionista</h2></div>
                    <div style={{ height: 2, width: 130, background: '#0b1f44', marginBottom: 12 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
                      <div style={{ border: '1px solid #fde68a', background: '#fffbeb', borderRadius: 10, padding: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={16} /><strong>Proyección esperada a 5 años</strong></div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8 }}>
                          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}><div style={{ fontSize: 12 }}>Escenario promedio</div><div style={{ fontWeight: '700' }}>{projection ? formatCurrency(projection.year5Average) : '-'}</div></div>
                          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}><div style={{ fontSize: 12 }}>Mejor escenario</div><div style={{ fontWeight: '700' }}>{projection ? formatCurrency(projection.year5Best) : '-'}</div></div>
                          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}><div style={{ fontSize: 12 }}>Peor escenario</div><div style={{ fontWeight: '700' }}>{projection ? formatCurrency(projection.year5Worst) : '-'}</div></div>
                        </div>
                        {projection && (
                          <>
                            <div style={{ width: '100%', height: 240, marginTop: 8, background: '#fff' }}>
                              <ResponsiveContainer width="100%" height="100%"><LineChart data={projection.chart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`} /><Tooltip formatter={(value: number) => [formatCurrency(value), '']} /><Legend layout="horizontal" align="left" verticalAlign="bottom" wrapperStyle={{ left: 0, bottom: -10 }} /><Line type="monotone" dataKey="Promedio" stroke="#0d3f73" dot={false} /><Line type="monotone" dataKey="Mejor" stroke="#d9b26c" dot={false} /><Line type="monotone" dataKey="Peor" stroke="#b91c1c" dot={false} /></LineChart></ResponsiveContainer>
                            </div>
                            <div style={{ marginTop: 10, borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                              <div style={{ color: '#64748b', fontSize: 13 }}>Dinero invertido</div>
                              <div style={{ fontSize: 16, fontWeight: 700 }}>{investmentAmount ? formatCurrency(investmentAmount) : 'No definido'}</div>
                            </div>
                          </>
                        )}
                      </div>

                      <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={16} /> <strong>Estructura de portafolio</strong></div>
                        {allocation && (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                              <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 8 }}><div><strong>Objetivo:</strong> {allocation.objetivo}</div><div>Retorno: {formatPercent(allocation.retornoPromedio)}</div><div>Mejor: {formatPercent(allocation.mejorEscenario)}</div><div>Riesgo: {formatPercent(allocation.maxRiesgoAnual)}</div></div>
                              <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 8 }}><div>Acciones: {allocation.acciones}</div><div>Bonos: {allocation.bonos}</div><div>Efectivo: {allocation.efectivo}</div></div>
                            </div>
                            <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
                              {allocation.subclases.map(([name, percent]) => (
                                <div key={name} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}><div style={{ fontWeight: 600 }}>{name}</div><div>Asignación: {percent}</div></div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {step > 0 && <button onClick={prevStep} style={{ borderRadius: 10, border: '1px solid #cbd5e1', padding: '10px 14px' }}><ChevronLeft size={16} /> Volver</button>}
                <button onClick={resetAll} style={{ borderRadius: 10, border: '1px solid #cbd5e1', padding: '10px 14px' }}><RotateCcw size={16} /> Reiniciar</button>
              </div>
              {!isResult && (
                <button onClick={nextStep} style={{ borderRadius: 10, background: '#1d4ed8', color: 'white', border: 'none', padding: '10px 14px' }} disabled={isIntro ? !canContinueFromIntro : !hasSelectedCurrent}>
                  {isIntro ? 'Comenzar' : step === totalQuestions ? 'Ver resultado' : 'Siguiente'} <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
