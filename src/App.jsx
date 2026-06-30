import { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  BarChart2, Users, Lightbulb, BookOpen, TrendingUp,
  Share2, Bookmark, Home, Clock, Settings, Plus,
  ExternalLink, Zap, ChevronRight, ChevronLeft, Check, X,
  Search, Filter, Trash2, Eye, EyeOff, Mail, Lock,
  Database, FileText, Bell, Monitor, User, AlertCircle, Moon, Sun,
  MessageSquare, Menu
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:          "#F7F8FA",
  surface:     "#FFFFFF",
  sidebar:     "#0F172A",
  primary:     "#2563EB",
  primaryLight:"#EFF6FF",
  text:        "#0F172A",
  textSub:     "#475569",
  textMuted:   "#94A3B8",
  border:      "#E2E8F0",
  borderLight: "#F1F5F9",
  rowBg:       "#F8FAFC",
  conf: {
    alto:  { color:"#16A34A", bg:"var(--conf-alto-bg)",  text:"var(--conf-alto-text)",  label:"Alta"  },
    medio: { color:"#CA8A04", bg:"var(--conf-medio-bg)", text:"var(--conf-medio-text)", label:"Media" },
    bajo:  { color:"#DC2626", bg:"var(--conf-bajo-bg)",  text:"var(--conf-bajo-text)",  label:"Baja"  },
  },
};

// ─── History data ─────────────────────────────────────────────────────────────
const HISTORY_INITIAL = [
  {
    id:0, initiative:"Onboarding de un nuevo servicio",
    celula:"Célula Fibra-Flow", date:"28 jun 2026", processingTime:"10s",
    confidence:["medio","alto","bajo","medio","bajo"],
    insight:"Se lanza un nuevo plan y hay que diseñar el onboarding: qué fricciones tuvieron onboardings anteriores, qué dice el research sobre usuarios nuevos de esos verticales, y qué componentes del Design System ya existen para ese tipo de flujo.",
    pillars: [
      {
        id:"metricas", icon:BarChart2, title:"Métricas actuales", short:"Métricas",
        confidence:"medio", source:"Looker", date:"jun 2026", type:"metrics",
        rows:[
          { label:"Conversión onboarding (planes existentes)", value:"61%",    dir:"down", note:"−4% vs trimestre anterior" },
          { label:"Abandono en verificación de domicilio",     value:"22%",    dir:"up",   note:"Histórico en lanzamientos previos" },
          { label:"Tiempo promedio de alta",                   value:"6m 50s", dir:"up",   note:"+1m vs benchmark de categoría" },
        ]
      },
      {
        id:"usuarios", icon:Users, title:"Usuarios afectados", short:"Usuarios",
        confidence:"alto", source:"Analytics", date:"jun 2026", type:"users",
        rows:[
          { label:"Usuarios potenciales del nuevo plan (mes 1)", value:"~9.800",        note:"Proyección de altas según plan de marketing" },
          { label:"Segmento más relevante",                      value:"Hogares sin FTTH", note:"62% del universo direccionable"            },
          { label:"Canal de alta principal",                     value:"App Mi Personal", note:"54% de las altas digitales"                 },
        ]
      },
      {
        id:"hipotesis", icon:Lightbulb, title:"Hipótesis existentes", short:"Hipótesis",
        confidence:"bajo", source:"Notion", date:"abr 2026", type:"hypotheses",
        items:[
          { text:"El paso de verificación de domicilio genera abandono por falta de claridad sobre cobertura", status:"sin validar"           },
          { text:"Reutilizar el Design System de onboarding validado en otros verticales acelera la entrega",  status:"sin validar"           },
          { text:"Reducir el formulario de alta de 5 a 3 pantallas mejoraría la conversión en +3pp",            status:"parcialmente validada" },
        ]
      },
      {
        id:"investigaciones", icon:BookOpen, title:"Investigaciones relacionadas", short:"Investigaciones",
        confidence:"medio", source:"Notion", date:"feb 2026", type:"research",
        items:[
          { title:"Fricciones en onboardings de planes anteriores (Internet, Móvil)", type:"UX Research", date:"feb 2026", relevance:"alta"  },
          { title:"Expectativas de usuarios nuevos en verticales de conectividad",     type:"Entrevistas", date:"dic 2025", relevance:"media" },
        ]
      },
      {
        id:"impacto", icon:TrendingUp, title:"Impacto esperado", short:"Impacto",
        confidence:"bajo", source:"Estimación interna", date:"jun 2026", type:"impact",
        items:[
          { metric:"Conversión onboarding nuevo plan", expected:"+5 a +8pp vs benchmark", note:"Si se reutilizan componentes del Design System" },
          { metric:"Tiempo de entrega del flujo",       expected:"−30% en desarrollo",      note:"Por reutilización de componentes existentes"   },
          { metric:"Activaciones mes 1",                expected:"~6.000–7.000",            note:"Estimación conservadora sobre universo direccionable" },
        ]
      },
    ]
  },
  {
    id:1, initiative:"Campaña de venta de productos en Tienda",
    celula:"Célula Tienda", date:"24 jun 2026", processingTime:"12s",
    confidence:["alto","medio","alto","medio","bajo"],
    insight:"Se requiere sumar e incentivar la campaña masiva de Tienda sobre Cyberweek, y la campaña de lanzamiento de la nueva línea de productos Apple.",
    pillars: [
      {
        id:"metricas", icon:BarChart2, title:"Métricas actuales", short:"Métricas",
        confidence:"alto", source:"Looker", date:"jun 2026", type:"metrics",
        rows:[
          { label:"Conversión Tienda online (último Cyberweek)", value:"3.8%",      dir:"up", note:"+0.6pp vs Cyberweek anterior" },
          { label:"Ticket promedio categoría Apple",             value:"$612.400",  dir:"up", note:"+18% vs trimestre anterior"   },
          { label:"Tráfico estimado durante Cyberweek",          value:"+140%",     dir:"up", note:"vs tráfico promedio mensual"  },
        ]
      },
      {
        id:"usuarios", icon:Users, title:"Usuarios afectados", short:"Usuarios",
        confidence:"medio", source:"Analytics", date:"jun 2026", type:"users",
        rows:[
          { label:"Usuarios alcanzables en base CRM",        value:"~210.000", note:"Segmento con histórico de compra en Tienda" },
          { label:"Interesados en línea Apple (intención)",  value:"~38.000",  note:"Según señales de navegación, últimos 30 días" },
          { label:"Dispositivo principal de compra",         value:"Mobile",   note:"71% de las transacciones de Tienda"         },
        ]
      },
      {
        id:"hipotesis", icon:Lightbulb, title:"Hipótesis existentes", short:"Hipótesis",
        confidence:"alto", source:"Notion", date:"may 2026", type:"hypotheses",
        items:[
          { text:"Comunicar stock limitado y envío gratis aumenta la conversión durante Cyberweek",                      status:"parcialmente validada" },
          { text:"Un bundle de financiación destacado en el PDP de Apple mejora el ticket promedio",                      status:"sin validar"           },
          { text:"Los usuarios con un producto Apple ya registrado convierten 2x más rápido en cross-sell de accesorios", status:"parcialmente validada" },
        ]
      },
      {
        id:"investigaciones", icon:BookOpen, title:"Investigaciones relacionadas", short:"Investigaciones",
        confidence:"medio", source:"Notion", date:"abr 2026", type:"research",
        items:[
          { title:"Comportamiento de compra en Cyberweek 2025",                type:"Analytics Deep Dive", date:"dic 2025", relevance:"alta"  },
          { title:"Percepción de precio y financiación en categoría Apple",    type:"Encuesta a clientes", date:"feb 2026", relevance:"media" },
        ]
      },
      {
        id:"impacto", icon:TrendingUp, title:"Impacto esperado", short:"Impacto",
        confidence:"bajo", source:"Estimación interna", date:"jun 2026", type:"impact",
        items:[
          { metric:"Ventas incrementales Cyberweek",         expected:"+25% a +35%",  note:"vs semana equivalente sin campaña"        },
          { metric:"Unidades línea Apple (mes de lanzamiento)", expected:"~4.500–5.200", note:"Proyección según funnel de intención"   },
          { metric:"Revenue asociado",                        expected:"En análisis",  note:"Pendiente de validar pricing con Comercial" },
        ]
      },
    ]
  },
  {
    id:2, initiative:"Flujo transaccional Autogestión — Reserva de turno",
    celula:"Célula Posventa", date:"20 jun 2026", processingTime:"8s",
    confidence:["medio","medio","alto","bajo","medio"],
    insight:"Se requiere sumar una nueva funcionalidad en la cual los usuarios puedan reservar un turno en sucursales.",
    pillars: [
      {
        id:"metricas", icon:BarChart2, title:"Métricas actuales", short:"Métricas",
        confidence:"medio", source:"Looker", date:"jun 2026", type:"metrics",
        rows:[
          { label:"Visitas a sucursal sin turno previo", value:"44%",       dir:"up", note:"Genera demoras de atención y reclamos" },
          { label:"Llamadas a call center por turnos",   value:"~18.000/mes", dir:"up", note:"+9% vs mes anterior"                  },
          { label:"Uso de Autogestión (usuarios activos)", value:"62%",     dir:"up", note:"Base de clientes con cuenta activa"     },
        ]
      },
      {
        id:"usuarios", icon:Users, title:"Usuarios afectados", short:"Usuarios",
        confidence:"medio", source:"Analytics", date:"jun 2026", type:"users",
        rows:[
          { label:"Usuarios que visitan sucursal por mes", value:"~95.000",       note:"Estimación según tickets de atención" },
          { label:"Segmento con mayor fricción",            value:"Posventa técnica", note:"Reclamos y cambios de equipo"      },
          { label:"Plataforma principal de uso",            value:"App Mi Personal", note:"68% de las sesiones de Autogestión" },
        ]
      },
      {
        id:"hipotesis", icon:Lightbulb, title:"Hipótesis existentes", short:"Hipótesis",
        confidence:"alto", source:"Notion", date:"may 2026", type:"hypotheses",
        items:[
          { text:"Permitir reservar turno desde Autogestión reduce las visitas sin atención disponible", status:"parcialmente validada" },
          { text:"Mostrar disponibilidad en tiempo real disminuye las llamadas al call center",          status:"sin validar"           },
          { text:"Recordatorios automáticos del turno bajan el ausentismo en sucursal",                  status:"parcialmente validada" },
        ]
      },
      {
        id:"investigaciones", icon:BookOpen, title:"Investigaciones relacionadas", short:"Investigaciones",
        confidence:"bajo", source:"Notion", date:"feb 2026", type:"research",
        items:[
          { title:"Experiencia de atención en sucursales físicas",       type:"UX Research",         date:"nov 2025", relevance:"alta"  },
          { title:"Benchmark de reserva de turnos en otras industrias",  type:"Research competitivo", date:"ene 2026", relevance:"media" },
        ]
      },
      {
        id:"impacto", icon:TrendingUp, title:"Impacto esperado", short:"Impacto",
        confidence:"medio", source:"Estimación interna", date:"jun 2026", type:"impact",
        items:[
          { metric:"Visitas sin atención disponible",        expected:"−20% a −30%",   note:"Si se habilita reserva desde Autogestión"   },
          { metric:"Llamadas al call center por turnos",      expected:"−15%",          note:"Proyección conservadora"                    },
          { metric:"Satisfacción de atención en sucursal (CSAT)", expected:"+6 a +9 puntos", note:"Estimado según research de experiencia" },
        ]
      },
    ]
  },
  {
    id:3, initiative:"Flujo Cross-selling",
    celula:"Célula Cross-selling", date:"16 jun 2026", processingTime:"9s",
    confidence:["alto","bajo","medio","medio","alto"],
    insight:"Se requiere sumar cross-selling de un Extensor para usuarios que tienen internet o están por contratar, y cross-selling con usuarios que terminan de pagar algo en Autogestión.",
    pillars: [
      {
        id:"metricas", icon:BarChart2, title:"Métricas actuales", short:"Métricas",
        confidence:"alto", source:"Looker", date:"jun 2026", type:"metrics",
        rows:[
          { label:"Adjunto de Extensor en altas de Internet",    value:"7%",   dir:"down", note:"Muy por debajo del potencial estimado" },
          { label:"Cross-sell post-pago en Autogestión",          value:"3.1%", dir:"up",   note:"+0.4pp vs mes anterior"                },
          { label:"Usuarios con internet y cobertura WiFi débil", value:"31%",  dir:"up",   note:"Según diagnóstico de señal en app"     },
        ]
      },
      {
        id:"usuarios", icon:Users, title:"Usuarios afectados", short:"Usuarios",
        confidence:"bajo", source:"Analytics", date:"jun 2026", type:"users",
        rows:[
          { label:"Usuarios con internet activo, sin Extensor",  value:"~340.000",   note:"Universo potencial de cross-sell"      },
          { label:"Usuarios por contratar internet (en funnel)", value:"~12.000/mes", note:"Leads activos en proceso de alta"      },
          { label:"Pagos completados en Autogestión por mes",    value:"~480.000",   note:"Punto de contacto para ofrecer cross-sell" },
        ]
      },
      {
        id:"hipotesis", icon:Lightbulb, title:"Hipótesis existentes", short:"Hipótesis",
        confidence:"medio", source:"Notion", date:"may 2026", type:"hypotheses",
        items:[
          { text:"Ofrecer el Extensor en el mismo flujo de alta de internet aumenta el adjunto sin fricción adicional",          status:"sin validar"           },
          { text:"Mostrar el diagnóstico de señal WiFi como disparador del cross-sell mejora la conversión",                     status:"parcialmente validada" },
          { text:"Ofrecer cross-selling justo después de un pago exitoso en Autogestión tiene mejor receptividad que por push",  status:"parcialmente validada" },
        ]
      },
      {
        id:"investigaciones", icon:BookOpen, title:"Investigaciones relacionadas", short:"Investigaciones",
        confidence:"medio", source:"Notion", date:"mar 2026", type:"research",
        items:[
          { title:"Percepción de calidad de WiFi en el hogar",                       type:"Encuesta a clientes", date:"ene 2026", relevance:"alta"  },
          { title:"Momentos de mayor receptividad a ofertas (research de journeys)", type:"UX Research",         date:"dic 2025", relevance:"media" },
        ]
      },
      {
        id:"impacto", icon:TrendingUp, title:"Impacto esperado", short:"Impacto",
        confidence:"alto", source:"Estimación interna", date:"jun 2026", type:"impact",
        items:[
          { metric:"Adjunto de Extensor en altas",       expected:"+10 a +14pp",   note:"Si se integra en el flujo de alta de internet" },
          { metric:"Conversión cross-sell post-pago",     expected:"+1.5 a +2pp",  note:"Sobre el total de pagos en Autogestión"         },
          { metric:"Revenue incremental mensual",         expected:"En análisis",  note:"Pendiente de validar pricing de Extensor"       },
        ]
      },
    ]
  }
];

// ─── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"inicio",    Icon:Home,     label:"Inicio",    short:"Inicio"    },
  { id:"nueva",     Icon:Plus,     label:"Nueva consulta", short:"Nueva"     },
  { id:"historial", Icon:Clock,    label:"Historial",  short:"Historial" },
  { id:"guardados", Icon:Bookmark, label:"Guardados",  short:"Guardados" },
  { id:"config",    Icon:Settings, label:"Configuración", short:"Config"  },
];

const HISTORY = HISTORY_INITIAL; // will be managed as state in App

const MobileCtx = createContext(false);

// ─── Generating steps ─────────────────────────────────────────────────────────
const STEPS = [
  "Buscando en Looker...",
  "Consultando documentación en Notion...",
  "Analizando datos de Analytics...",
  "Cruzando fuentes disponibles...",
  "Generando insight principal...",
];

// ─── Atoms ────────────────────────────────────────────────────────────────────
function ConfBadge({ level }) {
  const cfg = C.conf[level] || { color:"#94A3B8", bg:"var(--conf-sin-datos-bg)", text:"#475569", label:"—" };
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:20,
      backgroundColor:cfg.bg, color:cfg.text,
      fontSize:11, fontWeight:700, letterSpacing:"0.03em",
      border:`1px solid ${cfg.color}30`
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", backgroundColor:cfg.color, display:"inline-block" }} />
      {cfg.label}
    </span>
  );
}

function StatusTag({ status }) {
  const ok = status === "parcialmente validada";
  return (
    <span style={{
      fontSize:10, fontWeight:700, letterSpacing:"0.04em", textTransform:"uppercase",
      padding:"2px 8px", borderRadius:4,
      backgroundColor: ok ? 'var(--conf-medio-bg)' : 'var(--conf-sin-datos-bg)',
      color: ok ? 'var(--conf-medio-text)' : 'var(--text-sub)'
    }}>
      {ok ? "Parcialmente validada" : "Sin validar"}
    </span>
  );
}

function TrendArrow({ dir }) {
  if (dir === "up")   return <span style={{ color:"#DC2626", fontSize:13, fontWeight:700 }}>↑</span>;
  if (dir === "down") return <span style={{ color:"#DC2626", fontSize:13, fontWeight:700 }}>↓</span>;
  return null;
}

function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width:44, height:24, borderRadius:12, cursor:"pointer",
      backgroundColor: value ? 'var(--primary)' : "#CBD5E1",
      position:"relative", transition:"background 0.2s", flexShrink:0
    }}>
      <div style={{
        position:"absolute", width:18, height:18, borderRadius:"50%",
        backgroundColor:"#fff", top:3, left: value ? 22 : 3,
        transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)"
      }} />
    </div>
  );
}

function ConfDots({ list }) {
  return (
    <div style={{ display:"flex", gap:4, alignItems:"center" }}>
      {list.map((level, i) => {
        const cfg = C.conf[level] || { color:"#CBD5E1" };
        return <span key={i} style={{ width:8, height:8, borderRadius:"50%", backgroundColor:cfg.color, display:"inline-block" }} />;
      })}
    </div>
  );
}

// ─── Mobile Menu (hamburger drawer) ──────────────────────────────────────────
function MobileMenu({ active, setActive, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:"fixed", inset:0, zIndex:400,
          backgroundColor:"rgba(0,0,0,0.45)"
        }}
      />
      {/* Drawer */}
      <div style={{
        position:"fixed", top:0, left:0, bottom:0, zIndex:500,
        width:260, backgroundColor:"#0076C7",
        display:"flex", flexDirection:"column",
        animation:"slideInLeft 0.22s ease"
      }}>
        {/* Header */}
        <div style={{
          padding:"20px 18px 16px",
          borderBottom:"1px solid rgba(255,255,255,0.12)",
          display:"flex", alignItems:"center", justifyContent:"space-between"
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:8, backgroundColor:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="16" height="16" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <polygon points="45,82 55,82 53,40 47,40" fill="#fff"/>
                <rect x="41" y="28" width="18" height="14" rx="2" fill="#fff"/>
                <polygon points="50,11 38,28 62,28" fill="#fff"/>
                <circle cx="50" cy="35" r="5" fill="#FBBF24"/>
                <rect x="33" y="82" width="34" height="7" rx="3" fill="#fff"/>
                <line x1="60" y1="29" x2="82" y2="13" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                <line x1="61" y1="33" x2="87" y2="33" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                <line x1="60" y1="37" x2="82" y2="53" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:14, color:"#fff", letterSpacing:"-0.02em" }}>Personal Beacon</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Decision Intelligence</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:6, backgroundColor:"rgba(255,255,255,0.15)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X size={14} color="#fff" />
          </button>
        </div>

        {/* Nav items */}
        <div style={{ flex:1, padding:"10px 10px" }}>
          {NAV.map(({ id, Icon, label }) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => { setActive(id); onClose(); }} style={{
                display:"flex", alignItems:"center", gap:12, width:"100%",
                padding:"12px 14px", borderRadius:8, marginBottom:2,
                backgroundColor: isActive ? "rgba(0,0,0,0.18)" : "transparent",
                border:"none", cursor:"pointer", textAlign:"left"
              }}>
                <Icon size={16} color={isActive ? "#fff" : "rgba(255,255,255,0.75)"} />
                <span style={{ fontSize:14, fontWeight: isActive ? 600 : 400, color: isActive ? "#fff" : "rgba(255,255,255,0.75)" }}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* User at bottom */}
        <div style={{ padding:"14px 18px", borderTop:"1px solid rgba(255,255,255,0.12)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", backgroundColor:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:11, fontWeight:700, color:"#fff" }}>CL</span>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:"#fff" }}>Corina L.</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)" }}>Célula Adquisición</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, collapsed, onToggle }) {
  const W = collapsed ? 60 : 220;
  return (
    <nav style={{
      width:W, backgroundColor:"#0076C7",
      display:"flex", flexDirection:"column", flexShrink:0,
      transition:"width 0.22s ease", overflow:"hidden"
    }}>
      {/* Logo + collapse toggle */}
      <div style={{
        padding: collapsed ? "16px 10px" : "16px 14px 14px",
        display:"flex", alignItems:"center",
        justifyContent: collapsed ? "center" : "space-between",
        borderBottom:"1px solid rgba(255,255,255,0.12)"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:30, height:30, borderRadius:8, flexShrink:0,
            backgroundColor:"rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            <svg width="16" height="16" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="45,82 55,82 53,40 47,40" fill="#fff"/>
              <rect x="41" y="28" width="18" height="14" rx="2" fill="#fff"/>
              <polygon points="50,11 38,28 62,28" fill="#fff"/>
              <circle cx="50" cy="35" r="5" fill="#FBBF24"/>
              <rect x="33" y="82" width="34" height="7" rx="3" fill="#fff"/>
              <line x1="60" y1="29" x2="82" y2="13" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
              <line x1="61" y1="33" x2="87" y2="33" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
              <line x1="60" y1="37" x2="82" y2="53" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight:800, fontSize:14, color:"#fff", letterSpacing:"-0.03em", whiteSpace:"nowrap" }}>Personal Beacon</div>
              <div style={{ fontSize:8, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.08em", marginTop:1, whiteSpace:"nowrap" }}>
                Decision Intelligence
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          style={{
            width:24, height:24, borderRadius:6, flexShrink:0,
            backgroundColor:"transparent", border:"none",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"
          }}
        >
          {collapsed
            ? <ChevronRight size={13} color="rgba(255,255,255,0.8)" />
            : <ChevronLeft  size={13} color="rgba(255,255,255,0.8)" />
          }
        </button>
      </div>

      {/* Nav items */}
      <div style={{ flex:1, padding: collapsed ? "8px 6px" : "8px 10px" }}>
        {NAV.map(({ id, Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              title={collapsed ? label : undefined}
              style={{
                display:"flex", alignItems:"center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap:10, width:"100%",
                padding: collapsed ? "11px 0" : "9px 12px",
                borderRadius:8, marginBottom:2,
                backgroundColor: isActive ? "rgba(0,0,0,0.18)" : "transparent",
                border:"none", cursor:"pointer", textAlign:"left"
              }}
            >
              <Icon size={15} color={isActive ? "#fff" : "rgba(255,255,255,0.72)"} />
              {!collapsed && (
                <span style={{
                  fontSize:13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#fff" : "rgba(255,255,255,0.72)",
                  whiteSpace:"nowrap"
                }}>
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>


    </nav>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
function UserChip({ darkMode, toggleDark }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{
        width:32, height:32, borderRadius:"50%",
        backgroundColor:"#0076C7",
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
      }}>
        <User size={16} color="#fff" />
      </div>
      <button onClick={toggleDark} title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"} style={{
        width:32, height:32, borderRadius:8, border:`1px solid var(--border)`,
        backgroundColor:'var(--row-bg)', cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        color:'var(--text-sub)', flexShrink:0
      }}>
        {darkMode ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  );
}

function TopBar({ nav, saved, setSaved, darkMode, toggleDark, activeQueryId, onMenuOpen, historyItems }) {
  const items = historyItems || HISTORY;
  const titles = { nueva:"Nueva consulta", historial:"Historial", guardados:"Guardados", config:"Configuración" };
  const activeItem = items.find(h => h.id === activeQueryId) || items[0];
  const shortTitle = activeItem.initiative.length > 32
    ? activeItem.initiative.slice(0, 32).trimEnd() + "…"
    : activeItem.initiative;

  const hamburger = (
    <button onClick={onMenuOpen} className="di-hamburger" style={{ width:36, height:36, borderRadius:8, border:`1px solid var(--border)`, backgroundColor:'var(--row-bg)', cursor:"pointer", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <Menu size={18} color="var(--text-sub)" />
    </button>
  );

  if (nav === "inicio") {
    return (
      <div className="di-topbar" style={{
        backgroundColor:'var(--surface)', borderBottom:`1px solid var(--border)`,
        display:"flex", alignItems:"center",
        justifyContent:"space-between", flexShrink:0, gap:10
      }}>
        {hamburger}
        <div style={{ minWidth:0, flex:1 }}>
          <div className="di-breadcrumb" style={{ alignItems:"center", gap:5, marginBottom:4 }}>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>Inicio</span>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>›</span>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>{activeItem.celula.replace('Célula ', '')}</span>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>›</span>
            <span style={{ fontSize:11, color:'var(--text-sub)', fontWeight:500 }}>{shortTitle}</span>
          </div>
          <h1
            key={activeQueryId}
            className="di-h1"
            style={{
              fontWeight:700, color:'var(--text)', margin:0,
              letterSpacing:"-0.02em", overflow:"hidden", textOverflow:"ellipsis",
              whiteSpace:"nowrap", animation:"titleFade 0.25s ease"
            }}
          >
            {activeItem.initiative}
          </h1>
        </div>
        <div className="di-topbar-user" style={{ display:"flex", flexShrink:0 }}>
          <UserChip darkMode={darkMode} toggleDark={toggleDark} />
          <div className="di-actions-row" style={{ gap:8, alignItems:"center" }}>
            <button style={{
              display:"flex", alignItems:"center", gap:5, padding:"7px 14px",
              borderRadius:8, cursor:"pointer",
              fontSize:12, fontWeight:500, color:"var(--primary)",
              backgroundColor:"transparent",
              border:`1px solid var(--primary)`
            }}>
              <Share2 size={12} />
              Compartir
            </button>
            <button onClick={() => setSaved(!saved)} style={{
              display:"flex", alignItems:"center", gap:5, padding:"7px 14px",
              borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600,
              backgroundColor: saved ? "#059669" : "var(--primary)",
              border:"none", color:"#fff"
            }}>
              <Bookmark size={12} fill="none" color="#fff" />
              {saved ? "Guardado" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="di-topbar" style={{
      backgroundColor:'var(--surface)', borderBottom:`1px solid var(--border)`,
      display:"flex", alignItems:"center",
      justifyContent:"space-between", flexShrink:0
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {hamburger}
        <h1 className="di-h1" style={{ fontWeight:700, color:'var(--text)', margin:0, letterSpacing:"-0.02em" }}>
          {titles[nav]}
        </h1>
      </div>
      <UserChip darkMode={darkMode} toggleDark={toggleDark} />
    </div>
  );
}

// ─── Inicio: Pillar Card ──────────────────────────────────────────────────────
function PillarCard({ pillar, fullWidth }) {
  const { icon:Icon, title, confidence, source, date, type } = pillar;
  const cfg = C.conf[confidence];
  return (
    <div style={{
      backgroundColor:'var(--surface)', borderRadius:12, border:`1px solid var(--border)`, display:"flex", flexDirection:"column",
      gridColumn: fullWidth ? "span 2" : "span 1", overflow:"hidden"
    }}>
      <div style={{ padding:"16px 20px 12px", borderBottom:`1px solid var(--border-light)`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:8, backgroundColor:cfg.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon size={15} color={cfg.color} />
          </div>
          <span style={{ fontWeight:600, fontSize:14, color:'var(--text)' }}>{title}</span>
        </div>
        <ConfBadge level={confidence} />
      </div>
      <div style={{ padding:"16px 20px", flex:1 }}>
        {type === "metrics" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {pillar.rows.map((row, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 12px", backgroundColor:'var(--row-bg)', borderRadius:8 }}>
                <span style={{ fontSize:13, color:'var(--text-sub)' }}>{row.label}</span>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontWeight:700, fontSize:16, color:'var(--text)' }}>{row.value}</span>
                  <TrendArrow dir={row.dir} />
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>{row.note}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {type === "users" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {pillar.rows.map((row, i) => (
              <div key={i} style={{ padding:"10px 12px", backgroundColor:'var(--row-bg)', borderRadius:8 }}>
                <div style={{ fontSize:10, color:'var(--text-muted)', textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:700, marginBottom:4 }}>{row.label}</div>
                <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
                  <span style={{ fontWeight:700, fontSize:18, color:'var(--text)' }}>{row.value}</span>
                  <span style={{ fontSize:12, color:'var(--text-sub)' }}>{row.note}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {type === "hypotheses" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {pillar.items.map((item, i) => (
              <div key={i} style={{ padding:"12px", backgroundColor:'var(--row-bg)', borderRadius:8 }}>
                <p style={{ fontSize:13, color:'var(--text)', margin:"0 0 8px", lineHeight:1.55 }}>{item.text}</p>
                <StatusTag status={item.status} />
              </div>
            ))}
          </div>
        )}
        {type === "research" && (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {pillar.items.map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px", backgroundColor:'var(--row-bg)', borderRadius:8 }}>
                <div style={{ width:36, height:36, borderRadius:8, backgroundColor:'var(--primary-light)', display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <BookOpen size={15} color={'var(--primary)'} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'var(--text)', margin:"0 0 4px" }}>{item.title}</p>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ fontSize:11, color:'var(--text-muted)' }}>{item.type} · {item.date}</span>
                    <span style={{
                      fontSize:10, fontWeight:700, letterSpacing:"0.04em", textTransform:"uppercase",
                      color: item.relevance === "alta" ? "#16A34A" : "#CA8A04",
                      backgroundColor: item.relevance === "alta" ? "#F0FDF4" : "#FEFCE8",
                      padding:"2px 6px", borderRadius:4
                    }}>Rel. {item.relevance}</span>
                  </div>
                </div>
                <ExternalLink size={13} color={'var(--text-muted)'} />
              </div>
            ))}
          </div>
        )}
        {type === "impact" && (
          <div className="di-impact-grid">
            {pillar.items.map((item, i) => (
              <div key={i} style={{ padding:"16px", backgroundColor:'var(--row-bg)', borderRadius:8, textAlign:"center" }}>
                <div style={{ fontSize:10, color:'var(--text-muted)', textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700, marginBottom:8 }}>{item.metric}</div>
                <div style={{ fontSize:22, fontWeight:700, color:'var(--text)', marginBottom:4 }}>{item.expected}</div>
                <div style={{ fontSize:11, color:'var(--text-sub)', lineHeight:1.4 }}>{item.note}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding:"10px 20px", borderTop:`1px solid var(--border-light)` }}>
        <span style={{ fontSize:11, color:'var(--text-muted)' }}>Fuente:&nbsp;<strong style={{ color:'var(--text-sub)', fontWeight:600 }}>{source}</strong>&nbsp;· {date}</span>
      </div>
    </div>
  );
}

// ─── Inicio: Insight & Coverage ───────────────────────────────────────────────
function InsightCard({ text }) {
  return (
    <div style={{
      backgroundColor:'var(--surface)', borderRadius:12, border:`1px solid var(--border)`,
      padding:"18px 22px", marginBottom:20,
      display:"flex", gap:14, alignItems:"flex-start"
    }}>
      <div style={{ width:34, height:34, borderRadius:8, backgroundColor:'var(--primary-light)', display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Zap size={15} color={'var(--primary)'} />
      </div>
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
          <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:'var(--primary)' }}>Insight principal</span>
          <span style={{ fontSize:11, color:'var(--text-muted)' }}>Generado por IA · basado en 4 fuentes activas</span>
        </div>
        <p style={{ fontSize:14, color:"#1E293B", lineHeight:1.65, margin:0 }}>{text}</p>
      </div>
    </div>
  );
}

function CoverageBar({ pillars }) {
  return (
    <div style={{ marginBottom:20 }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:8 }}>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {pillars.map(p => {
          const cfg = C.conf[p.confidence];
          return (
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:20, backgroundColor:cfg.bg, border:`1px solid ${cfg.color}30` }}>
              <span style={{ width:6, height:6, borderRadius:"50%", backgroundColor:cfg.color, display:"inline-block" }} />
              <span style={{ fontSize:11, fontWeight:600, color:cfg.text }}>{p.short}</span>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:"var(--text-muted)", marginBottom:5 }}>Referencias de validación</div>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          {[["alto","Alta","#16A34A"],["medio","Media","#CA8A04"],["bajo","Baja","#DC2626"]].map(([level, label, color]) => (
            <div key={level} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", backgroundColor:color, display:"inline-block", flexShrink:0 }} />
              <span style={{ fontSize:11, color:"var(--text-muted)", fontWeight:500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

// ─── Query Selector ──────────────────────────────────────────────────────────
// ─── Chat: system prompt builder ─────────────────────────────────────────────
function buildSystemPrompt(activeItem) {
  const p = activeItem.pillars;
  const metrics   = p[0].rows.map(r => `- ${r.label}: ${r.value} (${r.note})`).join("\n");
  const users     = p[1].rows.map(r => `- ${r.label}: ${r.value} — ${r.note}`).join("\n");
  const hypos     = p[2].items.map((h,i) => `${i+1}. "${h.text}" [${h.status}]`).join("\n");
  const research  = p[3].items.map(r => `- "${r.title}" (${r.type}, ${r.date}, relevancia ${r.relevance})`).join("\n");
  const impact    = p[4].items.map(r => `- ${r.metric}: ${r.expected} — ${r.note}`).join("\n");
  return `Sos un agente de análisis UX y producto en la plataforma Personal Beacon de Telecom/Personal Argentina. Tu rol es ayudar a los equipos a profundizar en la evidencia disponible para tomar mejores decisiones de diseño y producto.

Tenés cargado el siguiente briefing:

## Iniciativa: ${activeItem.initiative}
Célula: ${activeItem.celula}
Insight principal: ${activeItem.insight}

## ${p[0].title} · Fuente: ${p[0].source} · Confianza ${C.conf[p[0].confidence].label.toLowerCase()}
${metrics}

## ${p[1].title} · Fuente: ${p[1].source} · Confianza ${C.conf[p[1].confidence].label.toLowerCase()}
${users}

## ${p[2].title} · Fuente: ${p[2].source} · Confianza ${C.conf[p[2].confidence].label.toLowerCase()}
${hypos}

## ${p[3].title} · Fuente: ${p[3].source} · Confianza ${C.conf[p[3].confidence].label.toLowerCase()}
${research}

## ${p[4].title} · Fuente: ${p[4].source} · Confianza ${C.conf[p[4].confidence].label.toLowerCase()}
${impact}

Instrucciones: respondé siempre en español, de forma concisa y accionable. Priorizá insights por sobre explicaciones. Justificá recomendaciones con datos del briefing. Señalá gaps o riesgos cuando los detectes. Si te preguntan algo fuera del briefing, indicalo y sugerí cómo conseguir esos datos.`;
}

// ─── Chat: Message bubble ─────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  const lines = msg.content.split("\n");
  return (
    <div style={{ display:"flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom:10 }}>
      {!isUser && (
        <div style={{
          width:22, height:22, borderRadius:6, flexShrink:0, marginRight:8, marginTop:2,
          background:"var(--primary)",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <Zap size={10} color="#fff" />
        </div>
      )}
      <div style={{
        maxWidth:"82%", padding:"9px 13px",
        borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
        backgroundColor: isUser ? "var(--primary)" : "var(--row-bg)",
        border: isUser ? "none" : `1px solid var(--border)`,
        color: isUser ? "#fff" : "var(--text)",
        fontSize:13, lineHeight:1.6
      }}>
        {lines.map((line, li) => {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <span key={li}>
              {parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi}>{p}</strong> : p)}
              {li < lines.length - 1 && <br />}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chat: Panel ──────────────────────────────────────────────────────────────
const STARTERS = [
  "¿Qué hipótesis priorizarías validar primero?",
  "¿Cuáles son los principales riesgos no contemplados?",
  "¿Qué métricas adicionales deberíamos medir?",
  "¿Cómo impacta esto en el segmento de usuarios más crítico?",
];

function ChatPanel({ activeItem, onClose }) {
  const [messages, setMessages] = useState([{
    id:0, role:"assistant",
    content:`¡Hola! Tengo cargado el briefing de **${activeItem.initiative}**. Puedo ayudarte a profundizar en cualquier aspecto — métricas, hipótesis, usuarios afectados o riesgos. ¿Por dónde querés empezar?`
  }]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const hasUserMsg = messages.some(m => m.role === "user");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const t = text.trim();
    if (!t || loading) return;
    const userMsg = { id: messages.length, role:"user", content:t };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    inputRef.current?.focus();
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY || "", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system: buildSystemPrompt(activeItem),
          messages: next.map(m => ({ role:m.role, content:m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "No pude generar una respuesta. Intentá de nuevo.";
      setMessages(p => [...p, { id:p.length, role:"assistant", content:reply }]);
    } catch {
      setMessages(p => [...p, { id:p.length, role:"assistant", content:"Error al conectar con el agente. Verificá tu conexión e intentá de nuevo." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="di-chat-panel" style={{
      backgroundColor:'var(--surface)',
      display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden"
    }}>
      {/* Header */}
      <div style={{
        padding:"13px 16px", borderBottom:`1px solid var(--border)`,
        display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:30, height:30, borderRadius:8, flexShrink:0,
            backgroundColor:"#0076C7",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            <Zap size={13} color="#fff" />
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>Agente de análisis</div>
            <div style={{ fontSize:11, color:'var(--text-muted)', overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:210 }}>
              {activeItem.initiative}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          width:28, height:28, borderRadius:6, flexShrink:0,
          border:`1px solid var(--border)`, backgroundColor:'var(--row-bg)',
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <X size={12} color="var(--text-muted)" />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px" }}>
        {messages.map(m => <MessageBubble key={m.id} msg={m} />)}

        {/* Suggested questions — shown before first user message */}
        {!hasUserMsg && !loading && (
          <div style={{ marginTop:4 }}>
            <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:'var(--text-muted)', marginBottom:8 }}>
              Sugerencias
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {STARTERS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  textAlign:"left", padding:"8px 12px", borderRadius:8,
                  border:`1px solid var(--border)`, backgroundColor:'var(--row-bg)',
                  fontSize:12, color:'var(--text-sub)', cursor:"pointer"
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display:"flex", gap:5, padding:"11px 14px", backgroundColor:'var(--row-bg)', border:`1px solid var(--border)`, borderRadius:"12px 12px 12px 4px", width:"fit-content", marginTop:4 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width:6, height:6, borderRadius:"50%", backgroundColor:'var(--text-muted)',
                animation:`dotPulse 1.2s ${i*0.18}s ease-in-out infinite`
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding:"12px 14px", borderTop:`1px solid var(--border)`, display:"flex", gap:8, flexShrink:0 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Preguntá sobre el briefing..."
          style={{
            flex:1, padding:"9px 12px", borderRadius:8,
            border:`1.5px solid var(--border)`, backgroundColor:'var(--surface)',
            fontSize:13, color:'var(--text)', outline:"none"
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          style={{
            width:36, height:36, borderRadius:8, border:"none", flexShrink:0,
            background: input.trim() && !loading ? "var(--primary)" : "var(--border)",
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}
        >
          <ChevronRight size={16} color={input.trim() && !loading ? "#fff" : "var(--text-muted)"} />
        </button>
      </div>
    </div>
  );
}

// ─── Inicio: Query Selector ──────────────────────────────────────────────────
function QuerySelector({ activeQueryId, setActiveQueryId, setNav, chatOpen, onToggleChat, historyItems }) {
  const items = historyItems || HISTORY;
  const [open, setOpen] = useState(false);
  const active = items.find(h => h.id === activeQueryId) || items[0];

  return (
    <div style={{ marginBottom:20 }}>
      {/* Label row */}
      <div style={{ marginBottom:8 }}>
        <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:'var(--text-muted)' }}>
          Consulta activa
        </span>
      </div>

      {/* Selector trigger + Agente button */}
      <div style={{ display:"flex", gap:8, alignItems:"stretch" }}>
        <div style={{ flex:1, position:"relative" }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"11px 16px", borderRadius:10,
              border:`1.5px solid ${open ? "var(--primary)" : "var(--border)"}`,
              backgroundColor:'var(--surface)', cursor:"pointer", textAlign:"left",
              transition:"border-color 0.15s", minWidth:0
            }}
          >
            <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {active.initiative}
                </div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:1 }}>
                  {active.celula.replace("Célula ", "")} · {active.date}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0, marginLeft:12 }}>
              <ConfDots list={active.confidence} />
              <ChevronRight size={14} color="var(--text-muted)"
                style={{ transform: open ? "rotate(270deg)" : "rotate(90deg)", transition:"transform 0.15s" }}
              />
            </div>
          </button>

          {/* Dropdown */}
          {open && (
        <div className="di-dropdown-backdrop" onClick={() => setOpen(false)}>
        <div className="di-dropdown-menu" style={{
          backgroundColor:'var(--surface)', border:`1px solid var(--border)`,
          borderRadius:12, overflow:"hidden",
          boxShadow:"0 8px 30px rgba(0,0,0,0.12)"
        }} onClick={e => e.stopPropagation()}>
          <div style={{ padding:"8px 14px 6px", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:'var(--text-muted)' }}>
            {items.length} consultas recientes
          </div>
          {items.map((item) => {
            const isActive = item.id === activeQueryId;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveQueryId(item.id); setOpen(false); }}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  width:"100%", padding:"10px 14px", border:"none", cursor:"pointer",
                  textAlign:"left",
                  backgroundColor: isActive ? 'var(--primary-light)' : "transparent",
                  borderLeft: isActive ? `3px solid var(--primary)` : "3px solid transparent"
                }}
              >
                <div style={{ minWidth:0, flex:1 }}>
                  <div style={{
                    fontSize:13, fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--primary)' : 'var(--text)',
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"
                  }}>
                    {item.initiative}
                  </div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>
                    {item.celula.replace("Célula ", "")} · {item.date}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0, marginLeft:12 }}>
                  <ConfDots list={item.confidence} />
                  {isActive && <Check size={12} color="var(--primary)" />}
                </div>
              </button>
            );
          })}
          <div style={{ borderTop:`1px solid var(--border)`, padding:"8px 10px" }}>
            <button
              onClick={() => { setNav("historial"); setOpen(false); }}
              style={{
                display:"flex", alignItems:"center", gap:6, width:"100%",
                padding:"7px 10px", borderRadius:8, border:"none",
                backgroundColor:'var(--row-bg)', cursor:"pointer",
                fontSize:12, color:'var(--text-sub)', fontWeight:500
              }}
            >
              <Clock size={12} />
              Ver historial completo
            </button>
          </div>
        </div>
        </div>
          )}
        </div>
        <button
          onClick={onToggleChat}
          style={{
            fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:5,
            padding:"7px 14px", borderRadius:10, cursor: chatOpen ? "not-allowed" : "pointer",
            backgroundColor:"var(--primary)", border:"none", color:"#fff",
            opacity: chatOpen ? 0.45 : 1, flexShrink:0, alignSelf:"center"
          }}
          disabled={chatOpen}
        >
          <Zap size={12} color="#fff" />
          Chat
        </button>
      </div>
    </div>
  );
}

// ─── Inicio: Summary view (for non-primary history items) ─────────────────────
function SummaryBriefing({ item, onShowDetail }) {
  const pillars = ["Métricas","Usuarios","Hipótesis","Investigaciones","Impacto"];
  return (
    <div>
      {/* Insight */}
      <div style={{
        backgroundColor:'var(--surface)', borderRadius:12,
        border:`1px solid var(--border)`,
        padding:"18px 22px", marginBottom:20,
        display:"flex", gap:14, alignItems:"flex-start"
      }}>
        <div style={{
          width:34, height:34, borderRadius:8, backgroundColor:'var(--primary-light)',
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0
        }}>
          <Zap size={15} color="var(--primary)" />
        </div>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
            <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:'var(--primary)' }}>
              Insight principal
            </span>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>
              {item.date} · {item.processingTime}
            </span>
          </div>
          <p style={{ fontSize:14, color:'var(--text)', lineHeight:1.65, margin:0 }}>
            {item.insight}
          </p>
        </div>
      </div>

      {/* Coverage */}
      <div style={{
        backgroundColor:'var(--surface)', borderRadius:12,
        border:`1px solid var(--border)`, padding:"20px 24px", marginBottom:20
      }}>
        <div style={{ fontSize:12, fontWeight:600, color:'var(--text)', marginBottom:16 }}>
          Cobertura de pilares
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {item.confidence.map((level, i) => {
            const cfg = C.conf[level] || { color:"#94A3B8", bg:"var(--conf-sin-datos-bg)", text:"#475569", label:"—" };
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:12, color:'var(--text-sub)', width:140, flexShrink:0 }}>{pillars[i]}</span>
                <div style={{ flex:1, height:6, borderRadius:3, backgroundColor:'var(--border)' }}>
                  <div style={{ height:"100%", borderRadius:3, backgroundColor:cfg.color, width: level === "alto" ? "100%" : level === "medio" ? "65%" : "35%" }} />
                </div>
                <span style={{
                  fontSize:10, fontWeight:700, letterSpacing:"0.03em",
                  color:cfg.text, backgroundColor:cfg.bg,
                  padding:"2px 8px", borderRadius:10, minWidth:48, textAlign:"center"
                }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA row */}
      <div style={{
        backgroundColor:'var(--row-bg)', borderRadius:12,
        border:`1px solid var(--border)`,
        padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16
      }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginBottom:3 }}>
            Vista resumida del briefing
          </div>
          <div style={{ fontSize:12, color:'var(--text-muted)' }}>
            El detalle completo de los 5 pilares está disponible en el historial
          </div>
        </div>
        <button
          onClick={onShowDetail}
          style={{
            padding:"8px 18px", borderRadius:8, cursor:"pointer", flexShrink:0,
            fontSize:12, fontWeight:600, color:"var(--primary)",
            backgroundColor:"transparent", border:"1.5px solid var(--primary)"
          }}
        >
          Ver detalle →
        </button>
      </div>
    </div>
  );
}

// ─── Inicio: Full briefing ────────────────────────────────────────────────────
function InicioBriefing({ activeQueryId, setActiveQueryId, setNav, historyItems }) {
  const [chatOpen,    setChatOpen]    = useState(false);
  const [showDetail,  setShowDetail]  = useState(false);
  const items = historyItems || HISTORY;
  const activeItem = items.find(h => h.id === activeQueryId) || items[0];
  const isDemo = activeQueryId === 0;

  useEffect(() => { setChatOpen(false); setShowDetail(false); }, [activeQueryId]);

  const showCards = isDemo || showDetail;

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>
      <div key={activeQueryId} className="di-view-pad" style={{ flex:1, overflowY:"auto", animation:"contentFade 0.25s ease" }}>
        <QuerySelector
          activeQueryId={activeQueryId}
          setActiveQueryId={setActiveQueryId}
          setNav={setNav}
          chatOpen={chatOpen}
          onToggleChat={() => setChatOpen(o => !o)}
          historyItems={historyItems}
        />
        <CoverageBar pillars={activeItem.pillars} />
        {showCards ? (
          <>
            {!isDemo && (
              <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
                <button onClick={() => setShowDetail(false)} style={{
                  padding:"6px 14px", borderRadius:8, cursor:"pointer",
                  fontSize:12, fontWeight:500, color:"var(--primary)",
                  backgroundColor:"transparent", border:"1px solid var(--primary)"
                }}>
                  ← Ver resumen
                </button>
              </div>
            )}
            <InsightCard text={activeItem.insight} />
            <div className="di-pillar-grid">
              <PillarCard pillar={activeItem.pillars[0]} />
              <PillarCard pillar={activeItem.pillars[1]} />
              <PillarCard pillar={activeItem.pillars[2]} />
              <PillarCard pillar={activeItem.pillars[3]} />
              <PillarCard pillar={activeItem.pillars[4]} fullWidth />
            </div>
          </>
        ) : (
          <SummaryBriefing item={activeItem} onShowDetail={() => setShowDetail(true)} />
        )}
      </div>
      {chatOpen && (
        <ChatPanel
          activeItem={activeItem}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Nueva consulta ───────────────────────────────────────────────────────────
const ALL_PILLARS = [
  { id:"metricas",       label:"Métricas actuales"        },
  { id:"usuarios",       label:"Usuarios afectados"       },
  { id:"hipotesis",      label:"Hipótesis existentes"     },
  { id:"investigaciones",label:"Investigaciones"          },
  { id:"impacto",        label:"Impacto esperado"         },
];
const SUGGESTIONS = HISTORY_INITIAL.map(h => h.initiative);
const CELULAS = ["Tienda","Posventa","Fibra-Flow","Cross-selling","Entretenimiento","Checkout","Home","Conectividad","Tech"];

function GeneratingState({ step }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 20px", gap:32 }}>
      <div style={{ width:56, height:56, borderRadius:16, backgroundColor:"#0076C7", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Zap size={24} color="#fff" />
      </div>
      <div style={{ textAlign:"center" }}>
        <h3 style={{ fontSize:18, fontWeight:700, color:'var(--text)', margin:"0 0 6px", letterSpacing:"-0.02em" }}>Generando tu briefing...</h3>
        <p style={{ fontSize:13, color:'var(--text-muted)', margin:0 }}>Consultando fuentes disponibles</p>
      </div>
      <div style={{ width:"100%", maxWidth:360, display:"flex", flexDirection:"column", gap:10 }}>
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, opacity: i > step ? 0.3 : 1 }}>
              <div style={{
                width:20, height:20, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                backgroundColor: done ? "#F0FDF4" : active ? 'var(--primary-light)' : 'var(--row-bg)',
                border: `1.5px solid ${done ? "#16A34A" : active ? 'var(--primary)' : 'var(--border)'}`
              }}>
                {done ? <Check size={11} color="#16A34A" /> : active ? <span style={{ width:6,height:6,borderRadius:"50%",backgroundColor:'var(--primary)',display:"inline-block" }} /> : null}
              </div>
              <span style={{ fontSize:13, color: done ? "#16A34A" : active ? 'var(--text)' : 'var(--text-muted)', fontWeight: active ? 600 : 400 }}>{s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildGenericPillars() {
  return [
    { id:"metricas", icon:BarChart2, title:"Métricas actuales", short:"Métricas", confidence:"bajo", source:"Looker", date:"jun 2026", type:"metrics", rows:[
      { label:"Datos disponibles", value:"En proceso", note:"Aún no hay métricas históricas asociadas a esta iniciativa" },
    ]},
    { id:"usuarios", icon:Users, title:"Usuarios afectados", short:"Usuarios", confidence:"bajo", source:"Analytics", date:"jun 2026", type:"users", rows:[
      { label:"Segmento", value:"Por definir", note:"Se completará cuando se identifiquen los usuarios impactados" },
    ]},
    { id:"hipotesis", icon:Lightbulb, title:"Hipótesis existentes", short:"Hipótesis", confidence:"bajo", source:"Notion", date:"jun 2026", type:"hypotheses", items:[
      { text:"Sin hipótesis registradas aún para esta iniciativa", status:"sin validar" },
    ]},
    { id:"investigaciones", icon:BookOpen, title:"Investigaciones relacionadas", short:"Investigaciones", confidence:"bajo", source:"Notion", date:"jun 2026", type:"research", items:[
      { title:"No se encontraron investigaciones relacionadas", type:"—", date:"—", relevance:"baja" },
    ]},
    { id:"impacto", icon:TrendingUp, title:"Impacto esperado", short:"Impacto", confidence:"bajo", source:"Estimación interna", date:"jun 2026", type:"impact", items:[
      { metric:"Por estimar", expected:"—", note:"El impacto se calculará una vez definido el alcance" },
    ]},
  ];
}

function NuevaConsulta({ onGenerate }) {
  const [initiative,      setInitiative]      = useState("");
  const [celula,          setCelula]          = useState("Tienda");
  const [nombre,          setNombre]          = useState("");
  const [apellido,        setApellido]        = useState("");
  const [pillars,         setPillars]         = useState(ALL_PILLARS.map(p => p.id));
  const [description,     setDescription]     = useState("");
  const [context,         setContext]         = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating,    setIsGenerating]    = useState(false);
  const [step,            setStep]            = useState(0);

  const togglePillar = (id) =>
    setPillars(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setStep(0);
    const matched = HISTORY_INITIAL.find(
      h => h.initiative.trim().toLowerCase() === initiative.trim().toLowerCase()
    );
    const newItem = matched
      ? {
          ...matched,
          id: Date.now(),
          date: new Date().toLocaleDateString('es-AR', { day:'numeric', month:'short', year:'numeric' }),
        }
      : {
          id: Date.now(),
          initiative: initiative.trim(),
          celula: `Célula ${celula}`,
          date: new Date().toLocaleDateString('es-AR', { day:'numeric', month:'short', year:'numeric' }),
          processingTime: `${Math.floor(Math.random()*5)+7}s`,
          confidence: ["medio","medio","medio","medio","bajo"],
          insight: description.trim()
            ? `Briefing generado a partir de la consulta: "${description.trim()}". Por tratarse de una iniciativa nueva, los pilares se completarán a medida que haya más datos disponibles.`
            : "Briefing generado para esta iniciativa.",
          pillars: buildGenericPillars(),
        };
    let current = 0;
    const iv = setInterval(() => {
      current++;
      setStep(current);
      if (current >= STEPS.length - 1) {
        clearInterval(iv);
        setTimeout(() => { onGenerate(newItem); }, 700);
      }
    }, 520);
  };

  if (isGenerating) return <GeneratingState step={step} />;

  const canSubmit = initiative.trim() && nombre.trim() && apellido.trim() && description.trim() && pillars.length > 0;
  const anyFilled = initiative || nombre || apellido || description;

  const inputStyle = (filled) => ({
    width:"100%", padding:"10px 14px", borderRadius:10,
    border:`1.5px solid ${filled ? "var(--primary)" : "var(--border)"}`,
    fontSize:13, color:"var(--text)", outline:"none",
    backgroundColor:"var(--surface)", boxSizing:"border-box",
    transition:"border-color 0.15s", fontFamily:"inherit"
  });

  const labelStyle = {
    display:"block", fontSize:13, fontWeight:600,
    color:"var(--text)", marginBottom:6
  };

  const required = <span style={{ color:"#DC2626" }}>*</span>;

  return (
    <div className="di-form-pad">

      {/* 1 ── Nombre de la iniciativa */}
      <div style={{ marginBottom:24 }}>
        <label style={labelStyle}>Nombre de la iniciativa {required}</label>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)" }}>
            <Search size={15} color="var(--text-muted)" />
          </div>
          <input
            value={initiative}
            onChange={e => setInitiative(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            
            style={{ ...inputStyle(initiative), paddingLeft:40 }}
          />
          {showSuggestions && (
            <div style={{
              position:"absolute", top:"calc(100% + 6px)", left:0, right:0,
              backgroundColor:"var(--surface)", border:`1px solid var(--border)`,
              borderRadius:10, overflow:"hidden", zIndex:10,
              boxShadow:"0 4px 20px rgba(0,0,0,0.08)"
            }}>
              <div style={{ padding:"8px 12px 4px", fontSize:10, color:"var(--text-muted)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                Iniciativas recientes
              </div>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onMouseDown={() => {
                  setInitiative(s);
                  const match = HISTORY_INITIAL.find(h => h.initiative === s);
                  if (match) setCelula(match.celula.replace("Célula ", ""));
                }} style={{
                  display:"flex", alignItems:"center", gap:10, width:"100%",
                  padding:"9px 14px", border:"none", backgroundColor:"transparent",
                  cursor:"pointer", textAlign:"left", fontSize:13, color:"var(--text)", fontFamily:"inherit"
                }}>
                  <Clock size={13} color="var(--text-muted)" />
                  <span style={{ flex:1 }}>{s}</span>
                  <span style={{
                    fontSize:9, fontWeight:700, color:"#16A34A", backgroundColor:"#F0FDF4",
                    border:"1px solid #16A34A30", borderRadius:20, padding:"2px 7px",
                    textTransform:"uppercase", letterSpacing:"0.04em", flexShrink:0
                  }}>
                    Con datos
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2 ── Célula / Equipo */}
      <div style={{ marginBottom:24 }}>
        <label style={labelStyle}>Célula / Equipo {required}</label>
        <select
          value={celula}
          onChange={e => setCelula(e.target.value)}
          style={{
            width:"100%", padding:"10px 14px", borderRadius:10,
            border:`1.5px solid var(--border)`, fontSize:13, color:"var(--text)",
            backgroundColor:"var(--surface)", outline:"none", cursor:"pointer", fontFamily:"inherit"
          }}
        >
          {CELULAS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* 3 ── Owner */}
      <div style={{ marginBottom:24 }}>
        <label style={{ ...labelStyle, marginBottom:10 }}>Owner {required}</label>
        <div className="di-owner-grid">
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>
              Nombre
            </label>
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              
              style={inputStyle(nombre)}
            />
          </div>
          <div>
            <label style={{ display:"block", fontSize:11, fontWeight:600, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:5 }}>
              Apellido
            </label>
            <input
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              
              style={inputStyle(apellido)}
            />
          </div>
        </div>
      </div>

      {/* 4 ── Pilares a consultar */}
      <div style={{ marginBottom:24 }}>
        <label style={labelStyle}>Pilares a consultar {required}</label>
        <p style={{ fontSize:12, color:"var(--text-muted)", margin:"0 0 10px" }}>
          Seleccioná qué dimensiones querés incluir en el briefing
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {ALL_PILLARS.map(p => {
            const active = pillars.includes(p.id);
            return (
              <button key={p.id} onClick={() => togglePillar(p.id)} style={{
                padding:"7px 14px", borderRadius:20,
                border:`1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
                backgroundColor: active ? "var(--primary-light)" : "var(--surface)",
                color: active ? "var(--primary)" : "var(--text-sub)",
                fontSize:12, fontWeight: active ? 600 : 400, cursor:"pointer",
                display:"flex", alignItems:"center", gap:5, fontFamily:"inherit"
              }}>
                {active && <Check size={11} />}
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5 ── Descripción del pedido */}
      <div style={{ marginBottom:24 }}>
        <label style={labelStyle}>Descripción del pedido {required}</label>
        <p style={{ fontSize:12, color:"var(--text-muted)", margin:"0 0 8px" }}>
          Describí qué querés resolver o entender con esta consulta
        </p>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          
          rows={4}
          style={{
            ...inputStyle(description),
            padding:"12px 14px", resize:"vertical", lineHeight:1.55
          }}
        />
      </div>

      {/* 6 ── Contexto adicional (opcional) */}
      <div style={{ marginBottom:32 }}>
        <label style={labelStyle}>
          Contexto adicional{" "}
          <span style={{ fontWeight:400, color:"var(--text-muted)" }}>(opcional)</span>
        </label>
        <p style={{ fontSize:12, color:"var(--text-muted)", margin:"0 0 8px" }}>
          Información complementaria: segmentos específicos, restricciones, iniciativas relacionadas
        </p>
        <textarea
          value={context}
          onChange={e => setContext(e.target.value)}
          
          rows={3}
          style={{
            ...inputStyle(false),
            padding:"12px 14px", resize:"vertical", lineHeight:1.55
          }}
        />
      </div>

      {/* Fuentes informativas */}
      <div style={{
        backgroundColor:"var(--row-bg)", borderRadius:10,
        border:`1px solid var(--border)`, padding:"14px 16px",
        marginBottom:24
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
          <Database size={13} color="var(--text-muted)" />
          <span style={{ fontSize:12, fontWeight:600, color:"var(--text-sub)" }}>
            Fuentes que se consultarán para generar el briefing
          </span>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[
            { name:"Looker",    color:"#F97316", bg:"#FFF7ED" },
            { name:"Analytics", color:"#0EA5E9", bg:"#F0F9FF" },
            { name:"Qualtrics", color:"#8B5CF6", bg:"#F5F3FF" },
            { name:"Notion",    color:"#374151", bg:"#F9FAFB" },
          ].map(src => (
            <span key={src.name} style={{
              display:"inline-flex", alignItems:"center", gap:5,
              padding:"4px 10px", borderRadius:20,
              backgroundColor:src.bg, border:`1px solid ${src.color}25`,
              fontSize:11, fontWeight:600, color:src.color
            }}>
              <span style={{ width:5, height:5, borderRadius:"50%", backgroundColor:src.color, display:"inline-block" }} />
              {src.name}
            </span>
          ))}
        </div>
        <p style={{ fontSize:11, color:"var(--text-muted)", margin:"10px 0 0", lineHeight:1.5 }}>
          Podés activar o desactivar fuentes desde{" "}
          <span style={{ color:"var(--primary)", fontWeight:600, cursor:"pointer" }}>
            Configuración
          </span>
          .
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={handleGenerate}
        disabled={!canSubmit}
        style={{
          width:"100%", padding:"14px", borderRadius:10, border:"none",
          backgroundColor: canSubmit ? "#0076C7" : "var(--border)",
          color: canSubmit ? "#fff" : "var(--text-muted)",
          fontSize:14, fontWeight:700, cursor: canSubmit ? "pointer" : "not-allowed",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          fontFamily:"inherit",
          boxShadow: canSubmit ? "0 2px 8px rgba(0,118,199,0.3)" : "none",
          transition:"background-color 0.15s, box-shadow 0.15s"
        }}
      >
        <Zap size={15} />
        Generar briefing
      </button>

      {!canSubmit && anyFilled && (
        <p style={{ fontSize:11, color:"var(--text-muted)", textAlign:"center", marginTop:8 }}>
          Completá los campos requeridos para continuar
        </p>
      )}
    </div>
  );
}


// ─── Historial ────────────────────────────────────────────────────────────────
function HistoryCard({ item, savedIds, onToggleSave, onView }) {
  const isSaved = savedIds.includes(item.id);
  return (
    <div style={{
      backgroundColor:'var(--surface)', borderRadius:12, border:`1px solid var(--border)`,
      padding:"18px 20px", marginBottom:12, display:"flex", flexDirection:"column", gap:12
    }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16 }}>
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:14, fontWeight:600, color:'var(--text)', margin:"0 0 6px", letterSpacing:"-0.01em" }}>
            {item.initiative}
          </h3>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ padding:"3px 10px", borderRadius:20, backgroundColor:'var(--primary-light)', color:"#1D4ED8", fontSize:11, fontWeight:600 }}>
              {item.celula.replace("Célula ", "")}
            </span>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>{item.date}</span>
            <span style={{ fontSize:11, color:'var(--text-muted)', display:"flex", alignItems:"center", gap:3 }}>
              <Zap size={10} color={'var(--text-muted)'} />{item.processingTime}
            </span>
          </div>
        </div>
        <ConfDots list={item.confidence} />
      </div>

      <p style={{ fontSize:13, color:'var(--text-sub)', margin:0, lineHeight:1.5, paddingLeft:0 }}>
        "{item.insight}"
      </p>

      <div style={{ display:"flex", gap:8, alignItems:"center", borderTop:`1px solid var(--border-light)`, paddingTop:12 }}>
        <button onClick={onView} style={{
          display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
          borderRadius:8, border:"none", backgroundColor:"var(--primary)",
          color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer"
        }}>
          <Eye size={13} />
          Ver briefing
        </button>
        <button onClick={() => onToggleSave(item.id)} style={{
          display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
          borderRadius:8, border:`1px solid ${isSaved ? "#BBF7D0" : "var(--primary)"}`,
          backgroundColor: isSaved ? "#F0FDF4" : "transparent",
          color: isSaved ? "#16A34A" : "var(--primary)",
          fontSize:12, fontWeight:500, cursor:"pointer"
        }}>
          <Bookmark size={13} fill={isSaved ? "#16A34A" : "none"} color={isSaved ? "#16A34A" : 'var(--text-sub)'} />
          {isSaved ? "Guardado" : "Guardar"}
        </button>
        <button style={{
          display:"flex", alignItems:"center", gap:6, padding:"7px 10px",
          borderRadius:8, border:`1px solid var(--border)`,
          backgroundColor:'var(--surface)', color:'var(--text-muted)',
          fontSize:12, cursor:"pointer", marginLeft:"auto"
        }}>
          <Share2 size={13} />
        </button>
      </div>
    </div>
  );
}

function Historial({ historyItems, savedIds, onToggleSave, onView }) {
  const items = historyItems || HISTORY;
  const [search, setSearch] = useState("");
  const filtered = items.filter(h =>
    h.initiative.toLowerCase().includes(search.toLowerCase()) ||
    h.celula.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="di-view-pad">
      <div style={{ display:"flex", gap:12, marginBottom:24, alignItems:"center" }}>
        <div style={{ flex:1, position:"relative" }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>
            <Search size={15} color={'var(--text-muted)'} />
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por iniciativa o célula..."
            style={{
              width:"100%", padding:"10px 14px 10px 38px", borderRadius:8,
              border:`1.5px solid var(--border)`, fontSize:13, color:'var(--text)',
              backgroundColor:'var(--surface)', outline:"none", boxSizing:"border-box"
            }}
          />
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 14px", borderRadius:8, border:`1px solid var(--primary)`, backgroundColor:"transparent", cursor:"pointer" }}>
          <Filter size={14} color={'var(--text-sub)'} />
          <span style={{ fontSize:12, color:"var(--primary)", fontWeight:600 }}>Filtrar</span>
        </div>
      </div>

      <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:16 }}>
        {filtered.length} consulta{filtered.length !== 1 ? "s" : ""}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <Clock size={32} color={'var(--border)'} style={{ marginBottom:12 }} />
          <p style={{ fontSize:14, color:'var(--text-muted)', margin:0 }}>No se encontraron consultas con ese término</p>
        </div>
      ) : (
        filtered.map(item => (
          <HistoryCard
            key={item.id}
            item={item}
            savedIds={savedIds}
            onToggleSave={onToggleSave}
            onView={onView}
          />
        ))
      )}
    </div>
  );
}

// ─── Guardados ────────────────────────────────────────────────────────────────
function Guardados({ historyItems, savedIds, onToggleSave, onView }) {
  const allItems = historyItems || HISTORY;
  const saved = allItems.filter(h => savedIds.includes(h.id));

  if (saved.length === 0) {
    return (
      <div className="di-empty-pad" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
        <div style={{ width:56, height:56, borderRadius:16, backgroundColor:'var(--row-bg)', display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
          <Bookmark size={24} color={'var(--border)'} />
        </div>
        <h3 style={{ fontSize:16, fontWeight:600, color:'var(--text)', margin:"0 0 8px" }}>
          Todavía no guardaste ningún briefing
        </h3>
        <p style={{ fontSize:13, color:'var(--text-muted)', margin:"0 0 24px", maxWidth:320, lineHeight:1.55 }}>
          Los briefings guardados aparecen acá para consulta rápida. Explorá el historial y guardá los más relevantes.
        </p>
      </div>
    );
  }

  return (
    <div className="di-view-pad">
      <div style={{ fontSize:12, color:'var(--text-muted)', marginBottom:20 }}>
        {saved.length} briefing{saved.length !== 1 ? "s" : ""} guardado{saved.length !== 1 ? "s" : ""}
      </div>
      <ColumnGrid>
        {saved.map(item => (
          <div key={item.id} style={{
            backgroundColor:'var(--surface)', borderRadius:12, border:`1px solid var(--border)`,
            padding:"18px 20px", display:"flex", flexDirection:"column", gap:14
          }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
              <h3 style={{ fontSize:13, fontWeight:600, color:'var(--text)', margin:0, lineHeight:1.4 }}>{item.initiative}</h3>
              <button onClick={() => onToggleSave(item.id)} style={{ border:"none", backgroundColor:"transparent", cursor:"pointer", flexShrink:0, padding:2 }}>
                <Bookmark size={14} fill="#16A34A" color="#16A34A" />
              </button>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ padding:"3px 10px", borderRadius:20, backgroundColor:'var(--primary-light)', color:"#1D4ED8", fontSize:11, fontWeight:600 }}>{item.celula.replace("Célula ", "")}</span>
              <ConfDots list={item.confidence} />
            </div>
            <p style={{ fontSize:12, color:'var(--text-sub)', margin:0, lineHeight:1.5 }}>"{item.insight}"</p>
            <div style={{ borderTop:`1px solid var(--border-light)`, paddingTop:12 }}>
              <button onClick={onView} style={{
                display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
                borderRadius:8, border:"none", backgroundColor:"var(--primary)",
                color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer"
              }}>
                <Eye size={13} />
                Ver briefing
              </button>
            </div>
          </div>
        ))}
      </ColumnGrid>
    </div>
  );
}

function ColumnGrid({ children }) {
  return (
    <div className="di-saved-grid">
      {children}
    </div>
  );
}

// ─── Configuración ────────────────────────────────────────────────────────────
const SOURCES = [
  { id:"looker",    label:"Looker",          desc:"Métricas y dashboards de negocio",    icon:BarChart2,  available:true  },
  { id:"qualtrics", label:"Qualtrics",       desc:"Encuestas y feedback de usuarios",    icon:MessageSquare, available:true  },
  { id:"notion",    label:"Notion",          desc:"Investigaciones y documentación",      icon:FileText,   available:true  },
  { id:"analytics", label:"Analytics",       desc:"Datos de comportamiento y eventos",    icon:TrendingUp, available:true  },
  { id:"bases",     label:"Bases internas",  desc:"Datasets internos del squad",          icon:Database,   available:true  },
  { id:"jira",      label:"Jira / Roadmap",  desc:"Tickets y épicas del backlog",         icon:AlertCircle,available:false },
];

function SettingSection({ title, children }) {
  return (
    <div style={{ marginBottom:32 }}>
      <h3 style={{ fontSize:13, fontWeight:700, color:'var(--text-muted)', textTransform:"uppercase", letterSpacing:"0.06em", margin:"0 0 16px" }}>{title}</h3>
      <div style={{ backgroundColor:'var(--surface)', borderRadius:12, border:`1px solid var(--border)`, overflow:"hidden" }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, desc, right, border=true }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px",
      borderBottom: border ? `1px solid var(--border-light)` : "none", gap:16
    }}>
      <div>
        <div style={{ fontSize:13, fontWeight:500, color:'var(--text)', marginBottom:2 }}>{label}</div>
        {desc && <div style={{ fontSize:12, color:'var(--text-muted)' }}>{desc}</div>}
      </div>
      {right}
    </div>
  );
}

function Configuracion() {
  const [sources, setSources] = useState({ looker:true, notion:true, analytics:true, bases:false, jira:false });
  const [defaultView, setDefaultView] = useState("ultima");
  const [notifs, setNotifs] = useState(true);

  return (
    <div className="di-config-pad">

      <SettingSection title="Perfil">
        <SettingRow
          label="Corina Letche"
          desc="corina.letche@personal.com.ar"
          right={
            <div style={{ width:38, height:38, borderRadius:"50%", background:"var(--primary)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>CL</span>
            </div>
          }
        />
        <SettingRow
          label="Célula"
          desc="Asignada por tu organización · no editable desde acá"
          border={false}
          right={<span style={{ padding:"4px 12px", borderRadius:20, backgroundColor:'var(--primary-light)', color:"#1D4ED8", fontSize:12, fontWeight:600 }}>Tienda</span>}
        />
      </SettingSection>

      <SettingSection title="Fuentes de datos habilitadas">
        {SOURCES.map((src, i) => {
          const Icon = src.icon;
          const enabled = sources[src.id];
          return (
            <SettingRow
              key={src.id}
              border={i < SOURCES.length - 1}
              label={
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:6, backgroundColor: enabled ? 'var(--primary-light)' : 'var(--row-bg)', display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon size={13} color={enabled ? 'var(--primary)' : 'var(--text-muted)'} />
                  </div>
                  <span style={{ color: src.available ? 'var(--text)' : 'var(--text-muted)' }}>{src.label}</span>
                  {!src.available && <span style={{ fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:4, backgroundColor:"#F1F5F9", color:'var(--text-muted)' }}>PRÓXIMAMENTE</span>}
                </div>
              }
              desc={src.desc}
              right={
                src.available
                  ? <Toggle value={enabled} onChange={v => setSources(p => ({ ...p, [src.id]:v }))} />
                  : <Toggle value={false} onChange={() => {}} />
              }
            />
          );
        })}
      </SettingSection>

      <SettingSection title="Preferencias">
        <SettingRow
          label="Vista de inicio"
          desc="Qué ves al abrir la plataforma"
          right={
            <select
              value={defaultView}
              onChange={e => setDefaultView(e.target.value)}
              style={{ padding:"7px 10px", borderRadius:8, border:`1px solid var(--border)`, fontSize:12, color:'var(--text)', backgroundColor:'var(--surface)', cursor:"pointer", outline:"none" }}
            >
              <option value="ultima">Última consulta</option>
              <option value="nueva">Nueva consulta</option>
              <option value="historial">Historial</option>
            </select>
          }
        />
        <SettingRow
          label="Notificaciones"
          desc="Recibir alertas cuando una fuente no esté disponible"
          border={false}
          right={<Toggle value={notifs} onChange={setNotifs} />}
        />
      </SettingSection>

      <SettingSection title="Zona de riesgo">
        <SettingRow
          border={false}
          label="Limpiar historial"
          desc="Elimina todas las consultas guardadas localmente"
          right={
            <button style={{
              display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
              borderRadius:8, border:`1px solid #FECDD3`, backgroundColor:"#FFF7F7",
              color:"#DC2626", fontSize:12, fontWeight:600, cursor:"pointer"
            }}>
              <Trash2 size={13} />
              Limpiar
            </button>
          }
        />
      </SettingSection>
    </div>
  );
}


// ─── Login Page ───────────────────────────────────────────────────────────────
const DEVICES_SVG = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA0MTMuNDQgMzk2LjA5Ij4KICA8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMzAuMi4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMi4xLjEgQnVpbGQgMSkgIC0tPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuc3QwIHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudDIpOwogICAgICB9CgogICAgICAuc3QxIHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudDEpOwogICAgICB9CgogICAgICAuc3QyIHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudDkpOwogICAgICB9CgogICAgICAuc3QzIHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudDYpOwogICAgICB9CgogICAgICAuc3Q0IHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudDgpOwogICAgICB9CgogICAgICAuc3Q1IHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudDcpOwogICAgICB9CgogICAgICAuc3Q2IHsKICAgICAgICBmb250LXNpemU6IDUuODNweDsKICAgICAgICBsZXR0ZXItc3BhY2luZzogLjFlbTsKICAgICAgfQoKICAgICAgLnN0NiwgLnN0NywgLnN0OCwgLnN0OSwgLnN0MTAsIC5zdDExLCAuc3QxMiwgLnN0MTMgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5zdDYsIC5zdDgsIC5zdDE0LCAuc3QxNSwgLnN0MTYsIC5zdDEzIHsKICAgICAgICBmb250LWZhbWlseTogSGVsdmV0aWNhLUJvbGQsIEhlbHZldGljYTsKICAgICAgICBmb250LXdlaWdodDogNzAwOwogICAgICB9CgogICAgICAuc3QxNyB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQxMik7CiAgICAgIH0KCiAgICAgIC5zdDE4IHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudDE1KTsKICAgICAgfQoKICAgICAgLnN0MTkgewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50MTEpOwogICAgICB9CgogICAgICAuc3QyMCB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQxMCk7CiAgICAgIH0KCiAgICAgIC5zdDIxIHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudDE0KTsKICAgICAgfQoKICAgICAgLnN0NyB7CiAgICAgICAgbWl4LWJsZW5kLW1vZGU6IG92ZXJsYXk7CiAgICAgICAgb3BhY2l0eTogLjQ7CiAgICAgIH0KCiAgICAgIC5zdDIyIHsKICAgICAgICBmaWxsOiB1cmwoI3JhZGlhbC1ncmFkaWVudCk7CiAgICAgIH0KCiAgICAgIC5zdDggewogICAgICAgIGZvbnQtc2l6ZTogMTkuMzhweDsKICAgICAgfQoKICAgICAgLnN0MTQgewogICAgICAgIGxldHRlci1zcGFjaW5nOiAuMWVtOwogICAgICB9CgogICAgICAuc3QxNCwgLnN0MTUgewogICAgICAgIGZvbnQtc2l6ZTogNS43cHg7CiAgICAgIH0KCiAgICAgIC5zdDE0LCAuc3QxNSwgLnN0MTYgewogICAgICAgIGZpbGw6ICMxZjIxMjE7CiAgICAgIH0KCiAgICAgIC5zdDE1IHsKICAgICAgICBsZXR0ZXItc3BhY2luZzogLjFlbTsKICAgICAgfQoKICAgICAgLnN0MjMgewogICAgICAgIGlzb2xhdGlvbjogaXNvbGF0ZTsKICAgICAgfQoKICAgICAgLnN0MTYgewogICAgICAgIGZvbnQtc2l6ZTogNS4wNnB4OwogICAgICAgIGxldHRlci1zcGFjaW5nOiAuMWVtOwogICAgICB9CgogICAgICAuc3QyNCB7CiAgICAgICAgc3Ryb2tlOiAjMDY1MDhjOwogICAgICAgIHN0cm9rZS13aWR0aDogLjc1cHg7CiAgICAgIH0KCiAgICAgIC5zdDI0LCAuc3QyNSB7CiAgICAgICAgZmlsbDogbm9uZTsKICAgICAgICBzdHJva2UtbWl0ZXJsaW1pdDogMTA7CiAgICAgIH0KCiAgICAgIC5zdDI2IHsKICAgICAgICBmaWxsOiB1cmwoI2xpbmVhci1ncmFkaWVudDUpOwogICAgICB9CgogICAgICAuc3QyNyB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQ0KTsKICAgICAgfQoKICAgICAgLnN0MjggewogICAgICAgIGZpbGw6IHVybCgjbGluZWFyLWdyYWRpZW50Myk7CiAgICAgIH0KCiAgICAgIC5zdDI1IHsKICAgICAgICBzdHJva2U6ICNmZmY7CiAgICAgICAgc3Ryb2tlLXdpZHRoOiAuNXB4OwogICAgICB9CgogICAgICAuc3QyOSB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQxMyk7CiAgICAgIH0KCiAgICAgIC5zdDkgewogICAgICB9CgogICAgICAuc3QxMCB7CiAgICAgIH0KCiAgICAgIC5zdDExIHsKICAgICAgfQoKICAgICAgLnN0MTIgewogICAgICB9CgogICAgICAuc3QzMCB7CiAgICAgICAgZmlsbDogIzA2NTA4YzsKICAgICAgfQoKICAgICAgLnN0MzEgewogICAgICAgIGZpbGw6IHVybCgjcmFkaWFsLWdyYWRpZW50MSk7CiAgICAgIH0KCiAgICAgIC5zdDMyIHsKICAgICAgICBmaWxsOiB1cmwoI3JhZGlhbC1ncmFkaWVudDMpOwogICAgICB9CgogICAgICAuc3QzMyB7CiAgICAgICAgZmlsbDogdXJsKCNyYWRpYWwtZ3JhZGllbnQyKTsKICAgICAgfQoKICAgICAgLnN0MzQgewogICAgICAgIGZpbGw6IHVybCgjcmFkaWFsLWdyYWRpZW50NSk7CiAgICAgIH0KCiAgICAgIC5zdDM1IHsKICAgICAgICBmaWxsOiB1cmwoI3JhZGlhbC1ncmFkaWVudDQpOwogICAgICB9CgogICAgICAuc3QzNiB7CiAgICAgICAgZmlsbDogdXJsKCNsaW5lYXItZ3JhZGllbnQpOwogICAgICB9CgogICAgICAuc3QxMyB7CiAgICAgICAgZm9udC1zaXplOiA2Ljk5cHg7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InJhZGlhbC1ncmFkaWVudCIgY3g9IjE5MS45MyIgY3k9IjIzIiBmeD0iMTkxLjkzIiBmeT0iMjMiIHI9Ii40IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii4yMSIgc3RvcC1jb2xvcj0iI2NlY2VjZSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ii42NyIgc3RvcC1jb2xvcj0iIzU3NTc1NyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDAiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InJhZGlhbC1ncmFkaWVudDEiIGN4PSIyODQuMTUiIGN5PSIyNDQuMTciIGZ4PSIyODQuMTUiIGZ5PSIyNDQuMTciIHI9Ii45NCIgeGxpbms6aHJlZj0iI3JhZGlhbC1ncmFkaWVudCIvPgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJyYWRpYWwtZ3JhZGllbnQyIiBjeD0iMjg4LjMyIiBjeT0iMjY0LjA4IiBmeD0iMjg4LjMyIiBmeT0iMjY0LjA4IiByPSIuMTciIHhsaW5rOmhyZWY9IiNyYWRpYWwtZ3JhZGllbnQiLz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0icmFkaWFsLWdyYWRpZW50MyIgY3g9IjIwMC43NSIgY3k9IjMxLjYyIiBmeD0iMjAwLjc1IiBmeT0iMzEuNjIiIHI9Ii40MyIgeGxpbms6aHJlZj0iI3JhZGlhbC1ncmFkaWVudCIvPgogICAgPHJhZGlhbEdyYWRpZW50IGlkPSJyYWRpYWwtZ3JhZGllbnQ0IiBjeD0iMjM2LjUyIiBjeT0iMzUyLjE1IiBmeD0iMjM2LjUyIiBmeT0iMzUyLjE1IiByPSIuNTQiIHhsaW5rOmhyZWY9IiNyYWRpYWwtZ3JhZGllbnQiLz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50IiB4MT0iMjkwLjg2IiB5MT0iMjY5LjQ1IiB4Mj0iMTI0LjYzIiB5Mj0iMTAzLjIzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzFkNWJkNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxYWI0ZDgiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudDEiIHgxPSIxMzUuODEiIHkxPSIxMTUiIHgyPSIyOTQuOTciIHkyPSIyNzQuMTciIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuODEgNDA5LjM5KSByb3RhdGUoLTkwKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMzMzNlN2MiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMDAwIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQyIiB4MT0iMzY5LjQ3IiB5MT0iMTkxLjE1IiB4Mj0iMjAzLjI1IiB5Mj0iMjQuOTMiIHhsaW5rOmhyZWY9IiNsaW5lYXItZ3JhZGllbnQiLz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50MyIgeDE9IjE4MS42MyIgeTE9IjQwOS43MyIgeDI9IjEwOS40NyIgeTI9IjMzNy41OCIgeGxpbms6aHJlZj0iI2xpbmVhci1ncmFkaWVudCIvPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQ0IiB4MT0iMTgxLjYzIiB5MT0iMzYyLjkzIiB4Mj0iMTA5LjQ3IiB5Mj0iMjkwLjc4IiB4bGluazpocmVmPSIjbGluZWFyLWdyYWRpZW50Ii8+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudDUiIHgxPSIxODEuNjMiIHkxPSIzMTQuOTQiIHgyPSIxMDkuNDciIHkyPSIyNDIuNzgiIHhsaW5rOmhyZWY9IiNsaW5lYXItZ3JhZGllbnQiLz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50NiIgeDE9IjMwNi45NCIgeTE9Ijk4LjE4IiB4Mj0iMzA2Ljk0IiB5Mj0iMTU0LjAxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzFkNWJkNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxYWI0ZDgiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudDciIHgxPSIzNTcuMTEiIHkxPSI5OC4xOCIgeDI9IjM1Ny4xMSIgeTI9IjE1NC4wMSIgeGxpbms6aHJlZj0iI2xpbmVhci1ncmFkaWVudDYiLz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyLWdyYWRpZW50OCIgeDE9IjM3NC40NSIgeTE9Ijk4LjE4IiB4Mj0iMzc0LjQ1IiB5Mj0iMTU0LjAxIiB4bGluazpocmVmPSIjbGluZWFyLWdyYWRpZW50NiIvPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQ5IiB4MT0iMzIzLjE3IiB5MT0iOTguMTgiIHgyPSIzMjMuMTciIHkyPSIxNTQuMDEiIHhsaW5rOmhyZWY9IiNsaW5lYXItZ3JhZGllbnQ2Ii8+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudDEwIiB4MT0iMzQwLjA1IiB5MT0iOTguMTgiIHgyPSIzNDAuMDUiIHkyPSIxNTQuMDEiIHhsaW5rOmhyZWY9IiNsaW5lYXItZ3JhZGllbnQ2Ii8+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InJhZGlhbC1ncmFkaWVudDUiIGN4PSI1NS41NyIgY3k9IjEzMi4xNCIgZng9IjU1LjU3IiBmeT0iMTMyLjE0IiByPSIuOSIgeGxpbms6aHJlZj0iI3JhZGlhbC1ncmFkaWVudCIvPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQxMSIgeDE9IjE0Mi43NiIgeTE9IjE1MS4zNyIgeDI9IjE0Mi43NiIgeTI9IjE5NS4zOSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxZDViZDYiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuMzgiIHN0b3AtY29sb3I9IiMxYWI0ZDgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNDQiIHN0b3AtY29sb3I9IiMyMGI2ZDkiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNTMiIHN0b3AtY29sb3I9IiMzM2JjZGMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNjIiIHN0b3AtY29sb3I9IiM1MmM2ZTEiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuNzQiIHN0b3AtY29sb3I9IiM3Y2Q0ZTgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuODYiIHN0b3AtY29sb3I9IiNiM2U2ZjIiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIuOTgiIHN0b3AtY29sb3I9IiNmNWZiZmQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmZmIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQxMiIgeDE9IjIwNy4zOCIgeTE9IjEyOS4zNSIgeDI9IjE4MS40NyIgeTI9IjEwMy40NSIgeGxpbms6aHJlZj0iI2xpbmVhci1ncmFkaWVudCIvPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXItZ3JhZGllbnQxMyIgeDE9IjMzNS44NiIgeTE9IjI2MC45IiB4Mj0iMjcyLjM5IiB5Mj0iMTk3LjQyIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4MC4yOCAtMTEzLjk1KSByb3RhdGUoNzkuMDEpIiB4bGluazpocmVmPSIjbGluZWFyLWdyYWRpZW50Ii8+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudDE0IiB4MT0iMzY0LjgyIiB5MT0iMjQ4LjM5IiB4Mj0iMzA4LjEyIiB5Mj0iMTkxLjY5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzMzMzg2MCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyMDIzM2YiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxpbmVhci1ncmFkaWVudDE1IiB4MT0iMzQ0LjA5IiB5MT0iMjY5LjEyIiB4Mj0iMjg3LjM5IiB5Mj0iMjEyLjQzIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2Ny41NCAtMTE5LjkzKSByb3RhdGUoNzYuOTMpIiB4bGluazpocmVmPSIjbGluZWFyLWdyYWRpZW50MTQiLz4KICA8L2RlZnM+CiAgPGcgY2xhc3M9InN0MjMiPgogICAgPGcgaWQ9Ik9CSkVDVFMiPgogICAgICA8cGF0aCBjbGFzcz0ic3QyMiIgZD0iTTE5MS41MywyM2MwLC4yMi4xOC40LjQuNHMuNC0uMTguNC0uNC0uMTgtLjQtLjQtLjQtLjQuMTgtLjQuNFoiLz4KICAgICAgPGNpcmNsZSBjbGFzcz0ic3QzMSIgY3g9IjI4NC4xNSIgY3k9IjI0NC4xNyIgcj0iLjk0Ii8+CiAgICAgIDxwYXRoIGNsYXNzPSJzdDMzIiBkPSJNMjg4LjQ4LDI2NC4wOGMwLC4wOS0uMDcuMTctLjE3LjE3cy0uMTctLjA3LS4xNy0uMTcuMDctLjE3LjE3LS4xNy4xNy4wNy4xNy4xN1oiLz4KICAgICAgPHBhdGggY2xhc3M9InN0MzIiIGQ9Ik0yMDAuNzUsMzEuNjJ2LjYxLTEuMjIuNjFaIi8+CiAgICAgIDxjaXJjbGUgY2xhc3M9InN0MzUiIGN4PSIyMzYuNTIiIGN5PSIzNTIuMTUiIHI9Ii41NCIvPgogICAgICA8cmVjdCBjbGFzcz0ic3QzNiIgeD0iMTM3LjgzIiB5PSIzMS41OSIgd2lkdGg9IjE1NC44MiIgaGVpZ2h0PSIzMjQuNDgiIHJ4PSIyNC4yNCIgcnk9IjI0LjI0Ii8+CiAgICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03Ny4xLDEyNC42M2gyNzZjOS4xLDAsMTYuNDksNy4zOSwxNi40OSwxNi40OXYxMDYuMzNjMCw5LjEtNy4zOSwxNi40OS0xNi40OSwxNi40OUg3Ny4xYy05LjEsMC0xNi40OS03LjM5LTE2LjQ5LTE2LjQ5di0xMDYuMzNjMC05LjEsNy4zOS0xNi40OSwxNi40OS0xNi40OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQwOS4zOSAtMjAuODEpIHJvdGF0ZSg5MCkiLz4KICAgICAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTI0OS45Niw1Mi4wNGgtNjAuMDZjLTMsMC01LjgtMS41Mi03LjQ0LTQuMDNsLTcuMDctMTAuODJoODQuMjZsLTkuNywxNC44NVoiLz4KICAgICAgPHJlY3QgY2xhc3M9InN0NyIgeD0iMTYxLjkyIiB5PSI3MS4zMSIgd2lkdGg9Ijc4LjYyIiBoZWlnaHQ9IjYuOTYiIHJ4PSIxLjk3IiByeT0iMS45NyIvPgogICAgICA8cmVjdCBjbGFzcz0ic3Q3IiB4PSIxNjEuOTIiIHk9IjkzLjUzIiB3aWR0aD0iNTMuOSIgaGVpZ2h0PSI2Ljk2IiByeD0iMS45NyIgcnk9IjEuOTciLz4KICAgICAgPHJlY3QgY2xhc3M9InN0NyIgeD0iMTYxLjkyIiB5PSIxMTIuOTkiIHdpZHRoPSI3OC42MiIgaGVpZ2h0PSI2Ljk2IiByeD0iMS45NyIgcnk9IjEuOTciLz4KICAgICAgPHJlY3QgY2xhc3M9InN0NyIgeD0iMjIwLjg3IiB5PSIzMjMuNzEiIHdpZHRoPSI1NC41OCIgaGVpZ2h0PSI2Ljk2IiByeD0iMS45NyIgcnk9IjEuOTciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ5Ni4zMSA2NTQuMzkpIHJvdGF0ZSgxODApIi8+CiAgICAgIDxyZWN0IGNsYXNzPSJzdDciIHg9IjIyMS41NSIgeT0iMzAxLjQ5IiB3aWR0aD0iNTMuOSIgaGVpZ2h0PSI2Ljk2IiByeD0iMS45NyIgcnk9IjEuOTciIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ5Ni45OSA2MDkuOTUpIHJvdGF0ZSgxODApIi8+CiAgICAgIDxyZWN0IGNsYXNzPSJzdDciIHg9IjE5Ni44MyIgeT0iMjgyLjA0IiB3aWR0aD0iNzguNjIiIGhlaWdodD0iNi45NiIgcng9IjEuOTciIHJ5PSIxLjk3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NzIuMjcgNTcxLjAzKSByb3RhdGUoMTgwKSIvPgogICAgICA8Zz4KICAgICAgICA8cmVjdCBjbGFzcz0ic3QyOCIgeD0iODQuMjUiIHk9IjM0Mi40NiIgd2lkdGg9IjExNC44OCIgaGVpZ2h0PSIyOS4yOCIgcng9IjEzLjcxIiByeT0iMTMuNzEiLz4KICAgICAgICA8dGV4dCBjbGFzcz0ic3QxMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTI2Ljg4IDM1OS41OSkiPjx0c3BhbiB4PSIwIiB5PSIwIj5GcmVlIERvd25sb2FkPC90c3Bhbj48L3RleHQ+CiAgICAgICAgPHJlY3QgY2xhc3M9InN0OSIgeD0iOTkuNjgiIHk9IjM1MC45OSIgd2lkdGg9IjEyLjE4IiBoZWlnaHQ9IjEyLjE4IiByeD0iMy4wNCIgcnk9IjMuMDQiLz4KICAgICAgICA8cG9seWxpbmUgY2xhc3M9InN0MjQiIHBvaW50cz0iMTAyLjg0IDM1Ny4wOSAxMDIuODQgMzU5LjI2IDEwOC43MSAzNTkuMjYgMTA4LjcxIDM1Ny4wOSIvPgogICAgICAgIDxsaW5lIGNsYXNzPSJzdDI0IiB4MT0iMTA1Ljc3IiB5MT0iMzU0LjY3IiB4Mj0iMTA1Ljc3IiB5Mj0iMzU3LjYyIi8+CiAgICAgICAgPHBvbHlsaW5lIGNsYXNzPSJzdDI0IiBwb2ludHM9IjEwNy4zIDM1Ni4xMyAxMDUuNzcgMzU3LjY2IDEwNC4yNSAzNTYuMTMiLz4KICAgICAgICA8cmVjdCBjbGFzcz0ic3QyNyIgeD0iODQuMjUiIHk9IjMwMS4zNCIgd2lkdGg9IjExNC44OCIgaGVpZ2h0PSIyOS4yOCIgcng9IjEzLjcxIiByeT0iMTMuNzEiLz4KICAgICAgICA8dGV4dCBjbGFzcz0ic3QxMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTI2Ljg4IDMxOC42NSkiPjx0c3BhbiB4PSIwIiB5PSIwIj5TaWduIFVwPC90c3Bhbj48L3RleHQ+CiAgICAgICAgPHJlY3QgY2xhc3M9InN0MTIiIHg9Ijk5LjY3IiB5PSIzMDkuNTYiIHdpZHRoPSIxMi4xOCIgaGVpZ2h0PSIxMi4xOCIgcng9IjMuMDQiIHJ5PSIzLjA0Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9InN0MzAiIGQ9Ik0xMDcuMSwzMTMuNzZjMCwuNzQtLjYsMS4zNC0xLjM0LDEuMzRzLTEuMzQtLjYtMS4zNC0xLjM0LjYtMS4zNCwxLjM0LTEuMzQsMS4zNC42LDEuMzQsMS4zNFoiLz4KICAgICAgICA8cGF0aCBjbGFzcz0ic3QyNCIgZD0iTTEwMi45OCwzMTguODh2LTEuMTZjMC0uNzguNjMtMS40MiwxLjQyLTEuNDJoMi43M2MuNzgsMCwxLjQyLjYzLDEuNDIsMS40MnYxLjE2Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9InN0MjYiIGQ9Ik0xODQuNSwyNTkuMTdoLTg1LjYxYy04LjA4LDAtMTQuNjQsNi41NS0xNC42NCwxNC42NGgwYzAsOC4wOCw2LjU1LDE0LjY0LDE0LjY0LDE0LjY0aDg1LjYxYzguMDgsMCwxNC42NC02LjU1LDE0LjY0LTE0LjY0aDBjMC04LjA4LTYuNTUtMTQuNjQtMTQuNjQtMTQuNjRaIi8+CiAgICAgICAgPHRleHQgY2xhc3M9InN0MTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyNi44OCAyNzYuNDgpIj48dHNwYW4geD0iMCIgeT0iMCI+U2hhcmU8L3RzcGFuPjwvdGV4dD4KICAgICAgICA8cmVjdCBjbGFzcz0ic3QxMSIgeD0iOTkuNjciIHk9IjI2Ny4zOSIgd2lkdGg9IjEyLjE4IiBoZWlnaHQ9IjEyLjE4IiByeD0iMy4wNCIgcnk9IjMuMDQiLz4KICAgICAgICA8Y2lyY2xlIGNsYXNzPSJzdDMwIiBjeD0iMTAzLjU1IiBjeT0iMjczLjYiIHI9IjEuMDEiLz4KICAgICAgICA8cGF0aCBjbGFzcz0ic3QzMCIgZD0iTTEwNy44NiwyNzAuNTJjMCwuNTYtLjQ1LDEuMDEtMS4wMSwxLjAxcy0xLjAxLS40NS0xLjAxLTEuMDEuNDUtMS4wMSwxLjAxLTEuMDEsMS4wMS40NSwxLjAxLDEuMDFaIi8+CiAgICAgICAgPHBhdGggY2xhc3M9InN0MzAiIGQ9Ik0xMDcuODYsMjc2LjQxYzAsLjU2LS40NSwxLjAxLTEuMDEsMS4wMXMtMS4wMS0uNDUtMS4wMS0xLjAxLjQ1LTEuMDEsMS4wMS0xLjAxLDEuMDEuNDUsMS4wMSwxLjAxWiIvPgogICAgICAgIDxwb2x5bGluZSBjbGFzcz0ic3QyNCIgcG9pbnRzPSIxMDYuNjkgMjc2LjI4IDEwMy4yNyAyNzMuNDcgMTA2LjY5IDI3MC43Ii8+CiAgICAgIDwvZz4KICAgICAgPGc+CiAgICAgICAgPHJlY3QgY2xhc3M9InN0MyIgeD0iMzAzLjk3IiB5PSI4OS4xIiB3aWR0aD0iNS45MyIgaGVpZ2h0PSI2NC4zOSIvPgogICAgICAgIDxyZWN0IGNsYXNzPSJzdDUiIHg9IjM1NC4xNSIgeT0iMTEwLjE1IiB3aWR0aD0iNS45MyIgaGVpZ2h0PSI0My4zNCIvPgogICAgICAgIDxyZWN0IGNsYXNzPSJzdDQiIHg9IjM3MS40OCIgeT0iOTUuMjkiIHdpZHRoPSI1LjkzIiBoZWlnaHQ9IjU4LjIiLz4KICAgICAgICA8cmVjdCBjbGFzcz0ic3QyIiB4PSIzMjAuMiIgeT0iMTExLjExIiB3aWR0aD0iNS45MyIgaGVpZ2h0PSI0Mi4zOSIvPgogICAgICAgIDxyZWN0IGNsYXNzPSJzdDIwIiB4PSIzMzcuMDgiIHk9Ijk4LjU4IiB3aWR0aD0iNS45MyIgaGVpZ2h0PSI1NC45MiIvPgogICAgICA8L2c+CiAgICAgIDxnPgogICAgICAgIDxwYXRoIGNsYXNzPSJzdDM0IiBkPSJNNTYuNDYsMTMyLjE0YzAsLjQ5LS40LjktLjkuOXMtLjktLjQtLjktLjkuNC0uOS45LS45LjkuNC45LjlaIi8+CiAgICAgICAgPHJlY3QgY2xhc3M9InN0MTAiIHg9IjMxLjg5IiB5PSIxMDkuNzgiIHdpZHRoPSIyMDcuMDYiIGhlaWdodD0iMTA4LjE5IiByeD0iOC4yIiByeT0iOC4yIi8+CiAgICAgICAgPHBhdGggY2xhc3M9InN0MTkiIGQ9Ik0yMjAuNjUsMjAyLjU1di01OS4xNmMtNy43OSwwLTcuNzksMTYuNTktMTUuNTgsMTYuNTlzLTExLjM4LTE2LjU5LTE5LjE3LTE2LjU5LTE0LjI2LDIwLjUzLTI3LjU3LDIwLjUzYy0xNC45NCwwLTE4LjU2LTE3Ljc1LTI4LjMxLTE3Ljc1LTUuNiwwLTEwLjI4LDEyLjUyLTE4LjQyLDEyLjUyLTEwLjA1LDAtNy43OS0yMi4wOC0xNS41OC0yMi4wOHMtNy43OSwyNS40MS0xNS41NywyNS40MS03Ljc5LTguODUtMTUuNTgtOC44NXY0OS4zOWgxNTUuNzdaIi8+CiAgICAgICAgPHRleHQgY2xhc3M9InN0MTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ0LjA5IDEzNC45MikiPjx0c3BhbiB4PSIwIiB5PSIwIj4xMDA8L3RzcGFuPjwvdGV4dD4KICAgICAgICA8dGV4dCBjbGFzcz0ic3QxNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDguMjQgMTQ3LjEpIj48dHNwYW4geD0iMCIgeT0iMCI+ODA8L3RzcGFuPjwvdGV4dD4KICAgICAgICA8dGV4dCBjbGFzcz0ic3QxNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDguMjQgMTU5LjU2KSI+PHRzcGFuIHg9IjAiIHk9IjAiPjYwPC90c3Bhbj48L3RleHQ+CiAgICAgICAgPHRleHQgY2xhc3M9InN0MTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4LjI0IDE3MS42KSI+PHRzcGFuIHg9IjAiIHk9IjAiPjQwPC90c3Bhbj48L3RleHQ+CiAgICAgICAgPHRleHQgY2xhc3M9InN0MTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4LjI0IDE4My43OCkiPjx0c3BhbiB4PSIwIiB5PSIwIj4yMDwvdHNwYW4+PC90ZXh0PgogICAgICAgIDx0ZXh0IGNsYXNzPSJzdDE2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1Mi4zOSAxOTUuMjYpIj48dHNwYW4geD0iMCIgeT0iMCI+MDwvdHNwYW4+PC90ZXh0PgogICAgICAgIDx0ZXh0IGNsYXNzPSJzdDE0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2NC41NyAyMDQuNzYpIj48dHNwYW4geD0iMCIgeT0iMCI+SmFuPC90c3Bhbj48L3RleHQ+CiAgICAgICAgPHRleHQgY2xhc3M9InN0MTQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDkzLjk0IDIwNC43NikiPjx0c3BhbiB4PSIwIiB5PSIwIj5GZWI8L3RzcGFuPjwvdGV4dD4KICAgICAgICA8dGV4dCBjbGFzcz0ic3QxNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIxLjk3IDIwNC43NikiPjx0c3BhbiB4PSIwIiB5PSIwIj5NYXI8L3RzcGFuPjwvdGV4dD4KICAgICAgICA8dGV4dCBjbGFzcz0ic3QxNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTUxLjU0IDIwNC43NikiPjx0c3BhbiB4PSIwIiB5PSIwIj5BcHI8L3RzcGFuPjwvdGV4dD4KICAgICAgICA8dGV4dCBjbGFzcz0ic3QxNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTc5LjE1IDIwNC43NikiPjx0c3BhbiB4PSIwIiB5PSIwIj5NYXk8L3RzcGFuPjwvdGV4dD4KICAgICAgICA8dGV4dCBjbGFzcz0ic3QxNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjA4LjUyIDIwNC43NikiPjx0c3BhbiB4PSIwIiB5PSIwIj5KdW48L3RzcGFuPjwvdGV4dD4KICAgICAgICA8cGF0aCBjbGFzcz0ic3QxNyIgZD0iTTIxNi4zNCwxMTguMjJoLTMwLjUzYy0yLjY3LDAtNC44MywyLjE2LTQuODMsNC44M2gwYzAsMi42NywyLjE2LDQuODMsNC44Myw0LjgzaDMwLjUzYzIuNjcsMCw0LjgzLTIuMTYsNC44My00LjgzaDBjMC0yLjY3LTIuMTYtNC44My00LjgzLTQuODNaIi8+CiAgICAgICAgPHRleHQgY2xhc3M9InN0NiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTkwLjczIDEyNC44NikiPjx0c3BhbiB4PSIwIiB5PSIwIj4yMDI0PC90c3Bhbj48L3RleHQ+CiAgICAgICAgPHBvbHlsaW5lIGNsYXNzPSJzdDI1IiBwb2ludHM9IjIxMy45OSAxMjIuNDggMjEyLjg1IDEyMy42MyAyMTEuNyAxMjIuNDgiLz4KICAgICAgPC9nPgogICAgICA8Zz4KICAgICAgICA8Y2lyY2xlIGNsYXNzPSJzdDI5IiBjeD0iMzA5LjI0IiBjeT0iMjM0LjI4IiByPSI2MC4zOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMzIgNDkzLjE5KSByb3RhdGUoLTc5LjAxKSIvPgogICAgICAgIDxwYXRoIGNsYXNzPSJzdDIxIiBkPSJNMzUwLjY3LDI3OC4xN2MxMS42Ni0xMS4wMSwxOC45NS0yNi42LDE4Ljk1LTQzLjksMC0zMy4zNS0yNy4wMy02MC4zOC02MC4zOC02MC4zOHY2Mi44NGw0MS40Myw0MS40M1oiLz4KICAgICAgICA8Y2lyY2xlIGNsYXNzPSJzdDE4IiBjeD0iMzA5LjI0IiBjeT0iMjM0LjI4IiByPSI0NS41IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMS4xMiA0ODIuNTQpIHJvdGF0ZSgtNzYuOTMpIi8+CiAgICAgICAgPHRleHQgY2xhc3M9InN0OCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjkzLjM3IDIzOS40KSI+PHRzcGFuIHg9IjAiIHk9IjAiPjY1JTwvdHNwYW4+PC90ZXh0PgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=";

function LoginPage({ onLogin }) {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [touched,      setTouched]      = useState(false);

  const canSubmit = email.trim() && password.trim();

  const handleSubmit = () => {
    setTouched(true);
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  const fieldStyle = (filled) => ({
    width:"100%", padding:"12px 14px 12px 42px", borderRadius:10,
    border:`1.5px solid ${filled ? "#0076C7" : "#E2E8F0"}`,
    fontSize:14, color:"#0F172A", outline:"none",
    backgroundColor:"#FFFFFF", boxSizing:"border-box",
    transition:"border-color 0.15s", fontFamily:"inherit"
  });

  return (
    <div style={{ display:"flex", flexDirection:"row", height:"100vh", overflow:"hidden", fontFamily:"'Inter', system-ui, sans-serif" }}>

      {/* ── Left: brand panel ─────────────────────────────────────── */}
      <div className="di-login-left" style={{
        flex:"0 0 55%", position:"relative", overflow:"hidden",
        background:"linear-gradient(150deg, #1A9AE0 0%, #0076C7 30%, #005EA3 65%, #003D75 100%)",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between",
        padding:"40px 48px 48px"
      }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", top:-120, right:-120, width:400, height:400, borderRadius:"50%", backgroundColor:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-80, left:-80, width:320, height:320, borderRadius:"50%", backgroundColor:"rgba(255,255,255,0.06)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"40%", left:-60, width:200, height:200, borderRadius:"50%", backgroundColor:"rgba(255,255,255,0.04)", pointerEvents:"none" }} />

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12, alignSelf:"flex-start", zIndex:1 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            backgroundColor:"rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            <Zap size={17} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight:800, fontSize:17, color:"#fff", letterSpacing:"-0.03em", lineHeight:1 }}>Personal Beacon</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.6)", textTransform:"uppercase", letterSpacing:"0.1em", marginTop:2 }}>Decision Intelligence</div>
          </div>
        </div>

        {/* SVG illustration */}
        <div style={{
          zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          flex:1, padding:"24px 0"
        }}>
          <img
            src={DEVICES_SVG}
            alt="DI/UX Platform"
            style={{ width:"100%", maxWidth:380, userSelect:"none", marginBottom:16 }}
          />
          <p style={{ fontSize:22, fontWeight:700, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em", lineHeight:1.25, textAlign:"center" }}>
            Tomá decisiones con<br />evidencia real.
          </p>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.65)", margin:0, lineHeight:1.5, textAlign:"center" }}>
            La plataforma de inteligencia de decisiones<br />para equipos ágiles de producto.
          </p>
        </div>
      </div>

      {/* ── Right: form panel ─────────────────────────────────────── */}
      <div className="di-login-right" style={{
        display:"flex", alignItems:"center", justifyContent:"center",
        backgroundColor:"#FFFFFF", padding:"48px"
      }}>
        <div style={{ width:"100%", maxWidth:380 }}>

          {/* Mobile logo */}
          <div className="di-login-mobile-logo" style={{ alignItems:"center", gap:10, marginBottom:28 }}>
            <div style={{ width:32, height:32, borderRadius:8, backgroundColor:"#0076C7", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Zap size={15} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:"#0F172A", letterSpacing:"-0.02em" }}>Personal Beacon</div>
              <div style={{ fontSize:9, color:"#94A3B8", textTransform:"uppercase", letterSpacing:"0.08em" }}>Decision Intelligence</div>
            </div>
          </div>

          {/* Header */}
          <div style={{ marginBottom:32 }}>
            <h1 style={{
              fontSize:30, fontWeight:800, color:"#0F172A",
              margin:"0 0 10px", letterSpacing:"-0.03em", lineHeight:1.15
            }}>
              ¡Bienvenidos!
            </h1>
            <p style={{ fontSize:14, color:"#64748B", margin:0, lineHeight:1.5 }}>
              Ingresá tus credenciales para acceder a la plataforma.
            </p>
          </div>

          {/* Email */}
          <div style={{ marginBottom:16, position:"relative" }}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#0F172A", marginBottom:6 }}>
              Email corporativo
            </label>
            <div style={{ position:"absolute", left:14, bottom:12, pointerEvents:"none" }}>
              <Mail size={16} color={email ? "#0076C7" : "#94A3B8"} />
            </div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              
              style={{...fieldStyle(email), paddingLeft:42}}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:28, position:"relative" }}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:"#0F172A", marginBottom:6 }}>
              Contraseña
            </label>
            <div style={{ position:"absolute", left:14, bottom:12, pointerEvents:"none" }}>
              <Lock size={16} color={password ? "#0076C7" : "#94A3B8"} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              
              style={{...fieldStyle(password), paddingLeft:42, paddingRight:44}}
            />
            <button
              onClick={() => setShowPassword(p => !p)}
              style={{
                position:"absolute", right:14, bottom:10,
                background:"none", border:"none", cursor:"pointer", padding:2
              }}
            >
              {showPassword
                ? <EyeOff size={16} color="#94A3B8" />
                : <Eye    size={16} color="#94A3B8" />
              }
            </button>
          </div>

          {/* Error */}
          {touched && !canSubmit && (
            <p style={{ fontSize:12, color:"#DC2626", margin:"-16px 0 16px", display:"flex", alignItems:"center", gap:4 }}>
              ✕ Completá email y contraseña para continuar
            </p>
          )}

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width:"100%", padding:"14px", borderRadius:10, border:"none",
              backgroundColor: loading ? "#4DA8E3" : "#0076C7",
              color:"#fff", fontSize:14, fontWeight:700, cursor: loading ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              fontFamily:"inherit", transition:"background-color 0.15s",
              boxShadow: loading ? "none" : "0 2px 12px rgba(0,118,199,0.35)"
            }}
          >
            {loading ? (
              <>
                <div style={{ width:16, height:16, borderRadius:"50%", border:"2.5px solid rgba(255,255,255,0.35)", borderTopColor:"#fff", animation:"spin 0.7s linear infinite" }} />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>

          {/* Footer */}
          <p style={{ textAlign:"center", fontSize:12, color:"#94A3B8", marginTop:24, lineHeight:1.5 }}>
            ¿Problemas para acceder? 
            <span style={{ color:"#0076C7", fontWeight:600, cursor:"pointer" }}>
              Contactá a tu administrador
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn,      setIsLoggedIn]      = useState(false);
  const [isMobile,        setIsMobile]        = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [historyItems,    setHistoryItems]    = useState(HISTORY_INITIAL);
  const [snackbar,        setSnackbar]        = useState(null);
  const [nav,           setNav]           = useState("inicio");
  const [darkMode,      setDarkMode]      = useState(false);
  const [collapsed,     setCollapsed]     = useState(false);
  const [activeQueryId, setActiveQueryId] = useState(0);
  const [briefingSaved, setBriefingSaved] = useState(false);
  const [savedIds,      setSavedIds]      = useState([0, 2]);

  const toggleSaved = (id) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const showSnackbar = (msg) => {
    setSnackbar(msg);
    setTimeout(() => setSnackbar(null), 4500);
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scroll = (el) => (
    <div style={{ flex:1, overflowY:"auto", paddingBottom: 0 }}>{el}</div>
  );

  const renderView = () => {
    switch (nav) {
      case "inicio":    return <InicioBriefing activeQueryId={activeQueryId} setActiveQueryId={setActiveQueryId} setNav={setNav} historyItems={historyItems} />;
      case "nueva":     return scroll(<NuevaConsulta onGenerate={(newItem) => {
        if (newItem) {
          setHistoryItems(prev => [newItem, ...prev]);
          setActiveQueryId(newItem.id);
          showSnackbar("La iniciativa se agregó con éxito y en breve se procesará el resultado");
        }
        setNav("inicio");
      }} />);
      case "historial": return scroll(<Historial historyItems={historyItems} savedIds={savedIds} onToggleSave={toggleSaved} onView={() => setNav("inicio")} />);
      case "guardados": return scroll(<Guardados historyItems={historyItems} savedIds={savedIds} onToggleSave={toggleSaved} onView={() => setNav("inicio")} />);
      case "config":    return scroll(<Configuracion />);
      default:          return null;
    }
  };

  if (!isLoggedIn) {
    return (
      <MobileCtx.Provider value={isMobile}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          * { box-sizing:border-box; margin:0; padding:0; }
          button, input { font-family:inherit; }
          @keyframes spin { to { transform:rotate(360deg); } }
          .di-login-left { display:flex; }
          .di-login-right { flex:0 0 45%; }
          .di-login-mobile-logo { display:none; }
          @media (max-width: 767px) {
            .di-login-left { display:none !important; }
            .di-login-right { flex:1 !important; }
            .di-login-mobile-logo { display:flex !important; }
          }
        `}</style>
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      </MobileCtx.Provider>
    );
  }

  return (
    <MobileCtx.Provider value={isMobile}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        button, select, input, textarea { font-family:inherit; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:4px; }
        :root {
          --bg:#F7F8FA; --surface:#FFFFFF; --sidebar-bg:#0076C7;
          --primary:#0076C7; --primary-light:#E6F3FC;
          --text:#0F172A; --text-sub:#475569; --text-muted:#6B7280;
          --border:#E2E8F0; --border-light:#F1F5F9; --row-bg:#F8FAFC;
          --conf-alto-bg:#F0FDF4;  --conf-alto-text:#166534;
          --conf-medio-bg:#FEFCE8; --conf-medio-text:#854D0E;
          --conf-bajo-bg:#FFF7F7;  --conf-bajo-text:#991B1B;
          --conf-sin-datos-bg:#F1F5F9;
        }
        .dark {
          --bg:#111318; --surface:#1A1F2E; --sidebar-bg:#00487A;
          --primary:#4DB8F0; --primary-light:#0A2438;
          --text:#F0F4F8; --text-sub:#9AAABA; --text-muted:#718096;
          --border:#2A3040; --border-light:#222836; --row-bg:#13161E;
          --conf-alto-bg:#082E18;  --conf-alto-text:#52E38A;
          --conf-medio-bg:#2A1900; --conf-medio-text:#FCD34D;
          --conf-bajo-bg:#2A0808;  --conf-bajo-text:#F87171;
          --conf-sin-datos-bg:#222836;
        }
        .dark ::-webkit-scrollbar-thumb { background:#3A4258; }
        .dark ::-webkit-scrollbar-track { background:#111318; }
        .dark input, .dark select, .dark textarea {
          color-scheme: dark;
        }
        @keyframes titleFade {
          from { opacity:0; transform:translateY(-4px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes contentFade {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes dotPulse {
          0%,100% { opacity:0.3; transform:scale(0.85); }
          50%     { opacity:1;   transform:scale(1.15); }
        }
        @keyframes snackbarIn {
          from { opacity:0; transform:translateX(-50%) translateY(8px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        @keyframes slideInLeft {
          from { transform:translateX(-100%); opacity:0; }
          to   { transform:translateX(0);    opacity:1; }
        }

        /* ── Responsive layout (CSS-driven, not JS-driven) ──────────────── */
        .di-sidebar-wrap { display:flex; flex-shrink:0; }
        .di-hamburger { display:none; }
        .di-breadcrumb { display:flex; }
        .di-actions-row { display:flex; }
        .di-h1 { font-size:18px; }
        .di-topbar { padding:12px 30px; }
        .di-topbar-user { flex-direction:column; align-items:flex-end; gap:10px; }
        .di-view-pad { padding:24px 30px; }
        .di-form-pad { max-width:620px; margin:0 auto; padding:40px 30px; }
        .di-config-pad { max-width:580px; margin:0 auto; padding:32px 30px; }
        .di-empty-pad { padding:100px 40px; }
        .di-pillar-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px; }
        .di-impact-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
        .di-owner-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .di-saved-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .di-chat-panel { width:370px; height:auto; border-left:1px solid var(--border); position:static; }
        .di-dropdown-backdrop { }
        .di-dropdown-menu { position:absolute; top:calc(100% + 6px); left:0; right:0; z-index:50; }
        .di-login-left { display:flex; }
        .di-celula-badge { }

        @media (max-width: 767px) {
          .di-sidebar-wrap { display:none !important; }
          .di-hamburger { display:flex !important; }
          .di-breadcrumb { display:none !important; }
          .di-actions-row { display:none !important; }
          .di-h1 { font-size:15px !important; }
          .di-topbar { padding:10px 16px !important; }
          .di-topbar-user { flex-direction:row !important; align-items:center !important; gap:8px !important; }
          .di-view-pad { padding:16px !important; }
          .di-form-pad { padding:24px 16px !important; }
          .di-config-pad { padding:20px 16px !important; }
          .di-empty-pad { padding:60px 24px !important; }
          .di-pillar-grid { gap:12px !important; }
          .di-impact-grid { grid-template-columns:1fr !important; }
          .di-owner-grid { grid-template-columns:1fr !important; }
          .di-saved-grid { grid-template-columns:1fr !important; gap:12px !important; }
          .di-chat-panel { width:100% !important; height:100% !important; border-left:none !important; position:fixed !important; inset:0 !important; z-index:300 !important; }
          .di-dropdown-backdrop { position:fixed !important; inset:0 !important; z-index:300 !important; background:rgba(0,0,0,0.4) !important; display:flex !important; align-items:flex-start !important; padding:80px 16px 0 !important; }
          .di-dropdown-menu { position:static !important; width:100% !important; }
          .di-login-left { display:none !important; }
          .di-celula-badge { font-size:10px !important; padding:3px 9px !important; }
        }
      `}</style>
      <div className={darkMode ? "dark" : ""} style={{ display:"flex", height:"100vh", fontFamily:"'Inter', system-ui, sans-serif", backgroundColor:'var(--bg)', overflow:"hidden" }}>
        <div className="di-sidebar-wrap">
          <Sidebar active={nav} setActive={setNav} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
        </div>
        <main style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <TopBar nav={nav} saved={briefingSaved} setSaved={setBriefingSaved} darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)} activeQueryId={activeQueryId} onMenuOpen={() => setMobileMenuOpen(true)} historyItems={historyItems} />
          {renderView()}
        </main>
        {mobileMenuOpen && <MobileMenu active={nav} setActive={setNav} onClose={() => setMobileMenuOpen(false)} />}
        {snackbar && (
          <div style={{
            position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
            backgroundColor:"var(--text)", color:"var(--bg)", padding:"12px 20px",
            borderRadius:10, display:"flex", alignItems:"center", gap:10,
            zIndex:1000, boxShadow:"0 4px 20px rgba(0,0,0,0.3)",
            animation:"snackbarIn 0.3s ease", whiteSpace:"nowrap"
          }}>
            <Check size={15} color="#4ADE80" />
            <span style={{ fontSize:13, fontWeight:500 }}>{snackbar}</span>
          </div>
        )}
      </div>
    </MobileCtx.Provider>
  );
}
