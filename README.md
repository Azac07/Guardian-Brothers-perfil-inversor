# Guardian-Brothers-perfil-inversor
import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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

type Option = {
  label: string;
  score: number;
};

type Question = {
  id: string;
  title: string;
  options?: Option[];
  type?: 'currency';
  placeholder?: string;
  showChart?: boolean;
};

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

const surveyConfig: {
  brand: string;
  subtitle: string;
  profiles: ProfileDefinition[];
  questions: Question[];
} = {
  brand: 'Guardian Brothers Wealth Management',
  subtitle:
    'Completa las respuestas durante la conversación con tu cliente y al final obtendrás su perfil con una proyección estimada.',
  profiles: [
    {
      key: 'muy-conservador',
      label: 'Muy conservador',
      min: 10,
      max: 11,
      projectionLabel: 'Muy limitada para bolsa',
      description:
        'Este perfil prioriza fuertemente la seguridad y la preservación del capital. La volatilidad natural del mercado podría no alinearse con su nivel de comodidad actual.',
      recommendation:
        'Por ahora, la bolsa probablemente no es lo suyo. Lo ideal sería evaluar primero alternativas mucho más defensivas y una estrategia de entrada gradual.',
    },
    {
      key: 'conservador',
      label: 'Conservador',
      min: 12,
      max: 23,
      projectionLabel: '8% - 12% anual',
      description:
        'Busca estabilidad, menor volatilidad y preservar el capital por encima de maximizar retornos.',
      recommendation:
        'Una cartera enfocada en instrumentos más estables y una exposición moderada al crecimiento.',
    },
    {
      key: 'equilibrado',
      label: 'Equilibrado',
      min: 24,
      max: 35,
      projectionLabel: '13% - 18% anual',
      description:
        'Busca balance entre crecimiento y seguridad, aceptando fluctuaciones moderadas a cambio de mejores retornos.',
      recommendation:
        'Una cartera diversificada con balance entre crecimiento, estabilidad y oportunidades de largo plazo.',
    },
    {
      key: 'agresivo',
      label: 'Agresivo',
      min: 36,
      max: 46,
      projectionLabel: '19% - 25% anual',
      description:
        'Prioriza el crecimiento del capital y tolera variaciones importantes en el corto plazo.',
      recommendation:
        'Una cartera orientada al crecimiento con mayor exposición a activos de mayor volatilidad.',
    },
  ],
  questions: [
    {
      id: 'amount',
      title: '¿Cuánto va a invertir?',
      type: 'currency',
      placeholder: 'Ej. 100000',
    },
    {
      id: 'q1',
      title:
        '1. ¿Cuándo necesitará acceder a esta cartera de inversiones, ya sea por medio de retiros regulares o una gran suma global?',
      options: [
        { label: 'Menos de un año', score: 1 },
        { label: '1 - 5 años', score: 1 },
        { label: '5 - 10 años', score: 1 },
        { label: '10 años o más', score: 1 },
      ],
    },
    {
      id: 'q2',
      title: '2. Elija la declaración que mejor describa el propósito principal de esta cartera.',
      options: [
        { label: 'Seguridad', score: 2 },
        { label: 'Protección contra la inflación', score: 4 },
        { label: 'Crecimiento y seguridad', score: 5 },
        { label: 'Crecimiento', score: 6 },
        { label: 'Crecimiento máximo', score: 7 },
      ],
    },
    {
      id: 'q3',
      title: '3. ¿Qué respuesta describe mejor su conocimiento de inversión?',
      options: [
        { label: 'Novato', score: 1 },
        { label: 'Principiante', score: 2 },
        { label: 'Bien', score: 3 },
        { label: 'Muy bien', score: 4 },
        { label: 'Excelente', score: 5 },
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
        {
          label: 'Actualmente no puedo cumplir con todas mis obligaciones financieras sin aumentar mi deuda.',
          score: 1,
        },
        {
          label: 'Puedo cumplir con todas mis obligaciones financieras, pero tengo poco o ningún ahorro.',
          score: 2,
        },
        {
          label:
            'Puedo cumplir con todas mis obligaciones financieras y puedo ahorrar menos del 10% de mis ingresos.',
          score: 3,
        },
        {
          label:
            'Puedo cumplir con todas mis obligaciones financieras y puedo ahorrar un 10% o más de mis ingresos.',
          score: 4,
        },
        {
          label: 'Tengo pocas obligaciones financieras y una gran cantidad de ahorros.',
          score: 5,
        },
      ],
    },
    {
      id: 'q6',
      title: '6. Si fuera propietario de una inversión que cayó 2% en un periodo de un año, ¿qué haría?',
      options: [
        {
          label: 'Vendería mi inversión a pesar de que conduciría a una pérdida inmediata.',
          score: 1,
        },
        {
          label: 'Esperaría hasta que vuelva a su valor original y luego la movería a algo menos volátil.',
          score: 2,
        },
        {
          label: 'Esperaría porque las fluctuaciones del mercado son normales.',
          score: 4,
        },
        {
          label: 'Compraría más de esta acción porque está a buen precio y voy a largo plazo.',
          score: 5,
        },
        {
          label:
            'Aprovecharía la caída para aumentar significativamente mi posición buscando mayor rendimiento futuro.',
          score: 6,
        },
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
      title:
        '9. Dadas las fluctuaciones de cualquier cartera, ¿cuánto tiempo estaría dispuesto a esperar a que sus inversiones recuperen cualquier valor perdido?',
      options: [
        { label: 'Menos de tres meses', score: 1 },
        { label: 'Tres a seis meses', score: 2 },
        { label: 'Seis meses a un año', score: 3 },
        { label: 'Un año a dos', score: 4 },
        { label: 'Dos a tres años', score: 5 },
      ],
    },
  ],
};

function getProfile(total: number) {
  return (
    surveyConfig.profiles.find((profile) => total >= profile.min && total <= profile.max) ||
    surveyConfig.profiles[2]
  );
}

function formatCurrency(value: string | number) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
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

  if (!numericAmount || profileKey === 'muy-conservador') {
    return null;
  }

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

function runSelfChecks() {
  console.assert(getProfile(10).key === 'muy-conservador', '10 debe mapear a muy-conservador');
  console.assert(getProfile(12).key === 'conservador', '12 debe mapear a conservador');
  console.assert(getProfile(24).key === 'equilibrado', '24 debe mapear a equilibrado');
  console.assert(getProfile(46).key === 'agresivo', '46 debe mapear a agresivo');
  console.assert(formatCurrency(100000) === '$100,000', 'El monto debe formatearse en USD');
  console.assert(sanitizeDigits('12a,3b4') === '1234', 'Solo deben quedar dígitos');
  const projection = calculateProjection('100000', 'equilibrado');
  console.assert(Boolean(projection), 'La proyección equilibrada no debe ser nula');
  console.assert(Math.round(projection?.year3Average || 0) === 148154, 'Proyección a 3 años incorrecta');
  console.assert(Math.round(projection?.year5Average || 0) === 192541, 'Proyección a 5 años incorrecta');
  console.assert(Math.round(projection?.year5Worst || 0) === 52773, 'Peor escenario a 5 años incorrecto');
  console.assert((projection?.chart.length || 0) === 6, 'El gráfico debe incluir años 0 a 5');
}

runSelfChecks();

function BrandHeader() {
  return (
    <div className='flex items-center gap-3'>
      <img
        src='/mnt/data/GB Center Icon (1).png'
        alt='Guardian Brothers Wealth Management'
        className='h-14 w-auto rounded-xl object-contain md:h-16'
      />
      <div>
        <p className='text-base font-semibold text-slate-900 md:text-lg'>Guardian Brothers</p>
        <p className='text-xs text-slate-500 md:text-sm'>Wealth Management</p>
      </div>
    </div>
  );
}

function ProfileBadge({ label }: { label: string }) {
  return (
    <span className='inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800'>
      {label}
    </span>
  );
}

export default function PerfilInversionistaApp() {
  const [clientName, setClientName] = useState('');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [investmentAmount, setInvestmentAmount] = useState('');

  const totalQuestions = surveyConfig.questions.length;
  const isIntro = step === 0;
  const isResult = step === totalQuestions + 1;
  const currentQuestion = surveyConfig.questions[step - 1];

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((sum, value) => sum + (value?.score || 0), 0);
  }, [answers]);

  const profile = useMemo(() => getProfile(totalScore), [totalScore]);
  const allocation =
    profile.key === 'muy-conservador'
      ? null
      : profileData[profile.key as 'conservador' | 'equilibrado' | 'agresivo'];
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

  const handleSelect = (questionId: string, option: Option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const nextStep = () => {
    if (isIntro) {
      if (!canContinueFromIntro) return;
      setStep(1);
      return;
    }

    if (!isResult && step <= totalQuestions && hasSelectedCurrent) {
      if (step === totalQuestions) {
        setStep(totalQuestions + 1);
      } else {
        setStep((prev) => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (isResult) {
      setStep(totalQuestions);
      return;
    }
    if (step > 0) setStep((prev) => prev - 1);
  };

  const resetAll = () => {
    setClientName('');
    setAnswers({});
    setInvestmentAmount('');
    setStep(0);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 p-3 md:p-8'>
      <div className='mx-auto max-w-6xl'>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className='overflow-hidden rounded-[28px] border-0 shadow-2xl'>
            <CardHeader className='bg-white pb-4'>
              <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                  <BrandHeader />
                  <CardTitle className='mt-4 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl'>
                    Perfil de Inversionista
                  </CardTitle>
                  <CardDescription className='mt-2 max-w-2xl text-sm leading-relaxed md:text-base'>
                    {surveyConfig.subtitle}
                  </CardDescription>
                </div>
                <div className='rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600'>
                  Optimizada para celular, iPad y laptop
                </div>
              </div>
              <div className='pt-3'>
                <Progress value={progress} className='h-3 rounded-full' />
              </div>
            </CardHeader>

            <CardContent className='p-4 md:p-6'>
              {isIntro && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className='rounded-3xl bg-slate-50 p-6'>
                    <div className='mb-4 flex items-center gap-3'>
                      <div className='rounded-2xl bg-white p-3 shadow-sm'>
                        <UserRound className='h-5 w-5' />
                      </div>
                      <h2 className='text-xl font-semibold'>Datos del cliente</h2>
                    </div>
                    <div>
                      <label className='mb-2 block text-sm font-medium'>Nombre del cliente</label>
                      <Input
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder='Ej. Juan Pérez'
                        className='h-12 rounded-2xl'
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {!isIntro && !isResult && currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='space-y-6'
                >
                  <div>
                    <div className='mb-2 text-sm font-medium text-slate-500'>
                      Pregunta {step} de {totalQuestions}
                    </div>
                    <h2 className='text-xl font-semibold leading-snug text-slate-900 md:text-2xl'>
                      {currentQuestion.title}
                    </h2>
                  </div>

                  {currentQuestion.type === 'currency' ? (
                    <div className='rounded-3xl border border-slate-200 bg-slate-50 p-6'>
                      <label className='mb-2 block text-sm font-medium text-slate-700'>Monto estimado en USD</label>
                      <Input
                        value={investmentAmount}
                        onChange={(e) => setInvestmentAmount(sanitizeDigits(e.target.value))}
                        placeholder={currentQuestion.placeholder}
                        className='h-14 rounded-2xl text-lg'
                        inputMode='numeric'
                      />
                      <p className='mt-3 text-sm text-slate-500'>
                        Monto capturado:{' '}
                        <span className='font-semibold'>
                          {investmentAmount ? formatCurrency(investmentAmount) : '$0'}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <>
                      {currentQuestion.showChart && (
                        <div className='space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 md:p-6'>
                          <div>
                            <p className='text-sm font-semibold text-slate-900'>Comparativo de portfolios</p>
                            <p className='mt-1 text-sm text-slate-500'>
                              Observa los retornos de cada portfolio en 5 años y elige el que más cómodo le resulte al cliente.
                            </p>
                          </div>

                          <div className='h-72 w-full rounded-2xl bg-white p-2 md:h-80'>
                            <ResponsiveContainer width='100%' height='100%'>
                              <LineChart data={portfolioQuestionChartData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='year' fontSize={12} />
                                <YAxis fontSize={12} unit='%' />
                                <Tooltip formatter={(value: number) => [`${value}%`, 'Retorno']} />
                                <Legend />
                                <Line type='monotone' dataKey='A' name='Portfolio A' stroke='#1e3a8a' strokeWidth={2} dot={false} />
                                <Line type='monotone' dataKey='B' name='Portfolio B' stroke='#2563eb' strokeWidth={2} dot={false} />
                                <Line type='monotone' dataKey='C' name='Portfolio C' stroke='#0f766e' strokeWidth={2} dot={false} />
                                <Line type='monotone' dataKey='D' name='Portfolio D' stroke='#ca8a04' strokeWidth={2} dot={false} />
                                <Line type='monotone' dataKey='E' name='Portfolio E' stroke='#b91c1c' strokeWidth={2} dot={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>

                          <div className='grid gap-3 md:grid-cols-2'>
                            {Object.entries(portfolioDescriptions).map(([key, value]) => (
                              <div key={key} className='rounded-2xl bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm'>
                                <p className='font-semibold text-slate-900'>{key}</p>
                                <p className='mt-1'>{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className='grid gap-3'>
                        {currentQuestion.options?.map((option) => {
                          const selected = answers[currentQuestion.id]?.label === option.label;
                          return (
                            <button
                              key={option.label}
                              onClick={() => handleSelect(currentQuestion.id, option)}
                              className={`rounded-2xl border p-4 text-left transition-all ${
                                selected
                                  ? 'border-[#0d3f73] bg-[#0d3f73] text-white shadow-lg'
                                  : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm'
                              }`}
                            >
                              <div className='flex items-start justify-between gap-4'>
                                <div>
                                  <span className='text-sm leading-6 md:text-base'>{option.label}</span>
                                  {currentQuestion.id === 'q8' && portfolioDescriptions[option.label] && (
                                    <p className={`mt-1 text-xs ${selected ? 'text-slate-200' : 'text-slate-500'}`}>
                                      {portfolioDescriptions[option.label]}
                                    </p>
                                  )}
                                </div>
                                {selected && (
                                  <span className='rounded-full bg-white/15 px-3 py-1 text-xs font-semibold'>
                                    Seleccionado
                                  </span>
                                )}
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
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='space-y-6'>
                  <div className='rounded-3xl bg-gradient-to-br from-[#0d3f73] to-slate-900 p-6 text-white shadow-xl'>
                    <div className='flex items-center gap-3'>
                      <CheckCircle2 className='h-7 w-7 text-[#e0bf84]' />
                      <h2 className='text-3xl font-semibold'>Resultado final</h2>
                    </div>
                    <p className='mt-4 text-lg leading-8 text-slate-100'>
                      El perfil detectado es <span className='font-semibold text-[#e0bf84]'>{profile.label}</span>.
                    </p>
                  </div>

                  <div className='grid gap-6 xl:grid-cols-3'>
                    <Card className='rounded-3xl shadow-lg xl:col-span-2'>
                      <CardHeader>
                        <div className='flex flex-wrap items-center gap-3'>
                          <CardTitle className='text-2xl'>Perfil {profile.label}</CardTitle>
                          <ProfileBadge label={profile.label} />
                        </div>
                        <CardDescription>Resultado del perfil y estructura propuesta.</CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-5 text-sm leading-7 text-slate-700 md:text-base'>
                        <p>{profile.description}</p>

                        <div className='rounded-2xl bg-slate-50 p-4'>
                          <p className='font-semibold text-slate-900'>Proyección estimada del perfil</p>
                          <p className='mt-1'>{profile.projectionLabel}</p>
                        </div>

                        <div className='rounded-2xl border border-slate-200 p-4'>
                          <p className='font-semibold text-slate-900'>Estrategia sugerida</p>
                          <p className='mt-1'>{profile.recommendation}</p>
                        </div>

                        {profile.key === 'muy-conservador' ? (
                          <div className='rounded-2xl border border-amber-200 bg-amber-50 p-4'>
                            <div className='flex items-center gap-2 text-amber-800'>
                              <TriangleAlert className='h-5 w-5' />
                              <p className='font-semibold'>Observación importante</p>
                            </div>
                            <p className='mt-2 text-amber-900'>
                              Este nivel de tolerancia sugiere que invertir en la bolsa podría no ser la opción más adecuada en este momento, ya que la volatilidad del mercado podría generar incomodidad o decisiones precipitadas.
                            </p>
                          </div>
                        ) : null}

                        {allocation && (
                          <div className='rounded-2xl border border-slate-200 p-4'>
                            <div className='mb-3 flex items-center gap-2'>
                              <ShieldCheck className='h-5 w-5 text-slate-700' />
                              <p className='font-semibold text-slate-900'>Estructura de portafolio</p>
                            </div>
                            <div className='grid gap-3 md:grid-cols-2'>
                              <div className='rounded-2xl bg-slate-50 p-4'>
                                <p><b>Objetivo:</b> {allocation.objetivo}</p>
                                <p><b>Retorno promedio:</b> {formatPercent(allocation.retornoPromedio)}</p>
                                <p><b>Mejor escenario:</b> {formatPercent(allocation.mejorEscenario)}</p>
                                <p><b>Máx riesgo anual:</b> {formatPercent(allocation.maxRiesgoAnual)}</p>
                                <p><b>Horizonte:</b> {allocation.horizonte}</p>
                              </div>
                              <div className='rounded-2xl bg-slate-50 p-4'>
                                <p><b>Acciones:</b> {allocation.acciones}</p>
                                <p><b>Bonos:</b> {allocation.bonos}</p>
                                <p><b>Efectivo:</b> {allocation.efectivo}</p>
                              </div>
                            </div>

                            <div className='mt-4 grid gap-3 md:grid-cols-2'>
                              {allocation.subclases.map(([name, percent]) => (
                                <div key={name} className='rounded-2xl bg-white p-4 shadow-sm'>
                                  <p className='font-semibold text-slate-900'>{name}</p>
                                  <p className='text-slate-600'>Asignación: {percent}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {projection && (
                          <div className='rounded-2xl border border-[#e0bf84] bg-[#fff8eb] p-4'>
                            <div className='mb-2 flex items-center gap-2'>
                              <TrendingUp className='h-5 w-5 text-[#0d3f73]' />
                              <p className='font-semibold text-slate-900'>Proyección esperada a 5 años</p>
                            </div>

                            <div className='mb-4 grid gap-3 md:grid-cols-3'>
                              <div className='rounded-2xl bg-white p-4'>
                                <p className='text-sm text-slate-500'>Escenario promedio</p>
                                <p className='text-lg font-semibold text-slate-900'>
                                  {formatCurrency(projection.year5Average)}
                                </p>
                              </div>
                              <div className='rounded-2xl bg-white p-4'>
                                <p className='text-sm text-slate-500'>Mejor escenario</p>
                                <p className='text-lg font-semibold text-slate-900'>
                                  {formatCurrency(projection.year5Best)}
                                </p>
                              </div>
                              <div className='rounded-2xl bg-white p-4'>
                                <p className='text-sm text-slate-500'>Peor escenario</p>
                                <p className='text-lg font-semibold text-slate-900'>
                                  {formatCurrency(projection.year5Worst)}
                                </p>
                              </div>
                            </div>

                            <div className='h-80 w-full rounded-2xl bg-white p-2'>
                              <ResponsiveContainer width='100%' height='100%'>
                                <LineChart data={projection.chart}>
                                  <CartesianGrid strokeDasharray='3 3' />
                                  <XAxis dataKey='year' fontSize={12} />
                                  <YAxis
                                    fontSize={12}
                                    tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
                                  />
                                  <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                                  <Legend />
                                  <Line type='monotone' dataKey='Promedio' stroke='#0d3f73' strokeWidth={3} dot={false} />
                                  <Line type='monotone' dataKey='Mejor' stroke='#d9b26c' strokeWidth={3} dot={false} />
                                  <Line type='monotone' dataKey='Peor' stroke='#b91c1c' strokeWidth={3} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className='rounded-3xl shadow-lg'>
                      <CardHeader>
                        <CardTitle>Resumen</CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-3 text-sm leading-6'>
                        <div>
                          <div className='text-slate-500'>Cliente</div>
                          <div className='font-semibold'>{clientName || 'No definido'}</div>
                        </div>
                        <div>
                          <div className='text-slate-500'>Monto estimado</div>
                          <div className='font-semibold'>
                            {investmentAmount ? formatCurrency(investmentAmount) : 'No definido'}
                          </div>
                        </div>
                        <div>
                          <div className='text-slate-500'>Perfil detectado</div>
                          <div className='font-semibold'>{profile.label}</div>
                        </div>
                        <div>
                          <div className='text-slate-500'>Rango del perfil</div>
                          <div className='font-semibold'>{profile.projectionLabel}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex gap-3'>
                  {step > 0 && (
                    <Button variant='outline' className='rounded-2xl' onClick={prevStep}>
                      <ChevronLeft className='mr-2 h-4 w-4' /> Volver
                    </Button>
                  )}
                  <Button variant='outline' className='rounded-2xl' onClick={resetAll}>
                    <RotateCcw className='mr-2 h-4 w-4' /> Reiniciar
                  </Button>
                </div>

                {!isResult && (
                  <Button
                    onClick={nextStep}
                    className='rounded-2xl bg-[#0d3f73] hover:bg-[#0a3159]'
                    disabled={isIntro ? !canContinueFromIntro : !hasSelectedCurrent}
                  >
                    {isIntro ? 'Comenzar' : step === totalQuestions ? 'Ver resultado' : 'Siguiente'}
                    <ChevronRight className='ml-2 h-4 w-4' />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

