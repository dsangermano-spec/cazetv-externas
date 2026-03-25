import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const SEED = {
  "Fevereiro 2025": {
    externas: [
      {id:"f1",evento:"Treino aberto João Fonseca",data:"05/02",mod:"Tênis",rep:"João Barretto",viagem:false,posts:4,nums:655800,prog:"Copa Davis e Geral CazéTV",ao:1,bol:1,yt:0,pauta:""},
      {id:"f2",evento:"ATP de Buenos Aires",data:"07/02",mod:"Tênis",rep:"João Barretto / Alemzão",viagem:true,posts:21,nums:2300000,prog:"Geral CazéTV",ao:3,bol:0,yt:0,pauta:""},
      {id:"f3",evento:"Treino + coletiva Patrick Mouratoglou",data:"10/02",mod:"Tênis",rep:"Lucca Bopp",viagem:false,posts:2,nums:245000,prog:"",ao:0,bol:0,yt:0,pauta:""},
      {id:"f4",evento:"Gravação Ítalo Ferreira",data:"11/02",mod:"Olímpicos",rep:"Crônicas de Jorge",viagem:false,posts:1,nums:376000,prog:"Geral CazéTV",ao:0,bol:1,yt:0,pauta:""},
      {id:"f5",evento:"Convocação Seleção Feminina",data:"12/02",mod:"Futebol Feminino",rep:"Laura Luzzi",viagem:false,posts:1,nums:357000,prog:"Geral CazéTV",ao:1,bol:0,yt:0,pauta:""},
      {id:"f6",evento:"Jhon Arias apresentação",data:"13/02",mod:"Futebol Masculino",rep:"Fala Porco",viagem:false,posts:8,nums:3300000,prog:"Transmissão jogo",ao:1,bol:0,yt:0,pauta:""},
      {id:"f7",evento:"Rio Open",data:"14/02",mod:"Tênis",rep:"João Barretto / Piquet",viagem:false,posts:69,nums:35072800,prog:"Redes/Transmissão",ao:0,bol:0,yt:0,pauta:""},
      {id:"f8",evento:"Rio Open criadores",data:"14/02",mod:"Tênis",rep:"Alemzão / 2 mista / Demo",viagem:false,posts:7,nums:1047000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"f9",evento:"Família Lucas Pinheiro",data:"15/02",mod:"Olímpicos",rep:"Papi Coisa Linda",viagem:false,posts:2,nums:3700000,prog:"Transmissão O. de Inverno",ao:1,bol:0,yt:0,pauta:""},
      {id:"f10",evento:"Família Lucas Pinheiro",data:"16/02",mod:"Olímpicos",rep:"Papi Coisa Linda",viagem:false,posts:1,nums:256000,prog:"Transmissão O. de Inverno",ao:1,bol:0,yt:0,pauta:""},
      {id:"f11",evento:"Entrevista Lucas Pinheiro",data:"18/02",mod:"Olímpicos",rep:"Luiza Romar",viagem:true,posts:2,nums:1430000,prog:"Lerigou",ao:0,bol:1,yt:0,pauta:""},
      {id:"f12",evento:"Neymar Red Bull",data:"20/02",mod:"Copa do Mundo",rep:"Bárbara Coelho",viagem:false,posts:8,nums:11100000,prog:"Transmissão e Geral CazéTV",ao:2,bol:0,yt:128000,pauta:""},
      {id:"f13",evento:"Tour da Taça SP",data:"23/02",mod:"Copa do Mundo",rep:"Victória Leite",viagem:false,posts:2,nums:395000,prog:"-",ao:1,bol:0,yt:0,pauta:""},
      {id:"f14",evento:"Tour da Taça RJ",data:"24/02",mod:"Copa do Mundo",rep:"Lucca Bopp",viagem:false,posts:3,nums:550000,prog:"-",ao:1,bol:0,yt:0,pauta:""},
      {id:"f15",evento:"Rafaela Silva - Instituto Reação",data:"24/02",mod:"Olímpicos",rep:"João Barretto",viagem:false,posts:1,nums:221000,prog:"Geral CazéTV",ao:1,bol:0,yt:0,pauta:""},
      {id:"f16",evento:"Bruninho e Chico - Final Recopa",data:"26/02",mod:"Futebol Masculino",rep:"Bruninho Maga / Chico Moedas",viagem:false,posts:1,nums:869000,prog:"Noche de Copa",ao:1,bol:0,yt:0,pauta:""},
      {id:"f17",evento:"Zico - Entrega Doações",data:"26/02",mod:"Futebol Masculino",rep:"Gabriel Simões",viagem:false,posts:1,nums:846000,prog:"Geral CazéTV",ao:1,bol:0,yt:0,pauta:""},
      {id:"f18",evento:"Tour da Taça Brasília",data:"26/02",mod:"Copa do Mundo",rep:"Day Natale",viagem:true,posts:2,nums:284000,prog:"Transmissão",ao:1,bol:0,yt:0,pauta:""},
      {id:"f19",evento:"Amistosos Seleção Feminina",data:"27/02",mod:"Futebol Feminino",rep:"Laura Luzzi",viagem:true,posts:16,nums:12140000,prog:"Geral / Fut Inter / Basquete",ao:6,bol:16,yt:0,pauta:""},
      {id:"f20",evento:"Amistoso Basquete Brasil x Venezuela",data:"27/02",mod:"Olímpicos",rep:"Daniel Gomes e Débora Elisa",viagem:false,posts:3,nums:1700000,prog:"Transmissão Fut Inter",ao:1,bol:0,yt:0,pauta:""},
      {id:"f21",evento:"Chegada Lindard Corinthians",data:"27/02",mod:"Futebol Masculino",rep:"Victória Leite",viagem:false,posts:1,nums:5200000,prog:"Transmissão",ao:1,bol:0,yt:3700,pauta:""},
      {id:"f22",evento:"Entrevista Matheus Bidu",data:"27/02",mod:"Futebol Masculino",rep:"Day Natale",viagem:false,posts:0,nums:0,prog:"Transmissão",ao:1,bol:0,yt:0,pauta:""},
      {id:"f23",evento:"Entrevista Novorizontino",data:"27/02",mod:"Futebol Masculino",rep:"Geovanni Henrique",viagem:false,posts:0,nums:0,prog:"Transmissão",ao:1,bol:0,yt:0,pauta:""}
    ],
    jogos: []
  },
  "Março 2025": {
    externas: [
      {id:"m1",evento:"Conselho técnico Paulistão",data:"02/03",mod:"Futebol Masculino",rep:"Victória Leite",viagem:false,posts:2,nums:6600000,prog:"Geral",ao:0,bol:2,yt:0,pauta:""},
      {id:"m2",evento:"Brasília Open (Tênis)",data:"02/03",mod:"Tênis",rep:"João Barretto",viagem:false,posts:70,nums:13275894,prog:"Geral / Transmissão Tênis",ao:4,bol:4,yt:0,pauta:""},
      {id:"m3",evento:"Amistoso Basquete Brasil x Colômbia",data:"02/03",mod:"Olímpicos",rep:"Daniel Gomes & Débora Elisa",viagem:true,posts:3,nums:700000,prog:"Transmissão Esportes Olímpicos",ao:1,bol:0,yt:0,pauta:""},
      {id:"m4",evento:"Chegada Leonardo Jardim",data:"03/03",mod:"Futebol Masculino",rep:"Bruna Dealtry",viagem:false,posts:3,nums:9300000,prog:"Noche de Copa",ao:0,bol:1,yt:0,pauta:""},
      {id:"m5",evento:"Coletiva Final do Paulistão",data:"03/03",mod:"Futebol Masculino",rep:"Victória Leite",viagem:false,posts:9,nums:5300000,prog:"Geral",ao:0,bol:1,yt:0,pauta:""},
      {id:"m6",evento:"Final do Paulistão pré",data:"04/03",mod:"Futebol Masculino",rep:"Geovanni Henrique",viagem:false,posts:3,nums:721600,prog:"Geral",ao:1,bol:2,yt:0,pauta:""},
      {id:"m7",evento:"Coletiva Renato Gaúcho",data:"04/03",mod:"Futebol Masculino",rep:"Bruna Dealtry",viagem:false,posts:7,nums:9421000,prog:"Geral",ao:1,bol:1,yt:0,pauta:""},
      {id:"m8",evento:"Coletiva Leonardo Jardim",data:"05/03",mod:"Futebol Masculino",rep:"Bruna Dealtry",viagem:false,posts:11,nums:6714000,prog:"Geral",ao:1,bol:0,yt:0,pauta:""},
      {id:"m9",evento:"Mercadão com torcida",data:"05/03",mod:"Futebol Masculino",rep:"Luiza Romar",viagem:false,posts:0,nums:0,prog:"Live Especial",ao:1,bol:0,yt:0,pauta:""},
      {id:"m10",evento:"Treino Corinthians",data:"05/03",mod:"Futebol Masculino",rep:"Day Natale",viagem:false,posts:5,nums:5619500,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"m11",evento:"Mundial de Skate",data:"06/03",mod:"Olímpicos",rep:"Pedro Cunha",viagem:false,posts:9,nums:14245000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"m12",evento:"Treino aberto Novorizontino",data:"06/03",mod:"Futebol Masculino",rep:"Geovanni Henrique",viagem:false,posts:0,nums:0,prog:"Transmissão Fut Inter",ao:1,bol:1,yt:0,pauta:""},
      {id:"m13",evento:"Final Carioca",data:"08/03",mod:"Futebol Masculino",rep:"Roger Terra",viagem:false,posts:18,nums:18361000,prog:"Redes",ao:1,bol:0,yt:0,pauta:""},
      {id:"m14",evento:"Indian Wells",data:"10/03",mod:"Tênis",rep:"João Barretto",viagem:true,posts:16,nums:3838400,prog:"Transmissão Esportes Olímpicos / Redes",ao:0,bol:2,yt:0,pauta:""},
      {id:"m15",evento:"Lançamento Camisa Azul Brasil",data:"12/03",mod:"Copa do Mundo",rep:"Victória Leite / Pedro Cunha",viagem:false,posts:9,nums:7699000,prog:"Geral / Transmissão Esportes Olímpicos",ao:0,bol:3,yt:0,pauta:""},
      {id:"m16",evento:"Evento PUMA NYC",data:"18/03",mod:"Copa do Mundo",rep:"Bruna Dealtry",viagem:true,posts:8,nums:4501000,prog:"Transmissão Fut Inter / Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"m17",evento:"Ligue 1",data:"20/03",mod:"Futebol Masculino",rep:"Victória Leite",viagem:true,posts:8,nums:4779000,prog:"Redes / Transmissão Esportes Olímpicos",ao:0,bol:0,yt:0,pauta:""},
      {id:"m18",evento:"Evento Basquete Shaquille O'Neal",data:"20/03",mod:"Copa do Mundo",rep:"Rene Ramirez",viagem:false,posts:8,nums:8028000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"m19",evento:"Data Fifa",data:"23/03",mod:"Copa do Mundo",rep:"Pedro Cunha / Casimiro",viagem:true,posts:0,nums:0,prog:"",ao:0,bol:0,yt:0,pauta:""},
      {id:"m20",evento:"Entrevista Deco",data:"25/03",mod:"Copa do Mundo",rep:"Linex",viagem:true,posts:0,nums:0,prog:"",ao:0,bol:0,yt:0,pauta:""}
    ],
    jogos: [
      {id:"j1",evento:"Final Carioca",data:"08/03",mod:"Futebol Masculino",rep:"Roger Terra / VH",viagem:false,posts:18,nums:18361000,prog:"Redes",ao:1,bol:0,yt:0,pauta:""},
      {id:"j2",evento:"Mirassol x Santos",data:"10/03",mod:"Futebol Masculino",rep:"Bruno Pires",viagem:false,posts:5,nums:4279000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j3",evento:"Corinthians x Coritiba",data:"11/03",mod:"Futebol Masculino",rep:"Ellen",viagem:false,posts:2,nums:1561000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j4",evento:"Flamengo x Cruzeiro",data:"11/03",mod:"Futebol Masculino",rep:"Roger Terra",viagem:false,posts:7,nums:3562000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j5",evento:"Atlético MG x Inter",data:"11/03",mod:"Futebol Masculino",rep:"Saldanha",viagem:false,posts:1,nums:161000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j6",evento:"Bahia x Vitória",data:"11/03",mod:"Futebol Masculino",rep:"Vitor Gomes / Matheus Barbaço",viagem:false,posts:3,nums:1689000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j7",evento:"Vasco x Palmeiras",data:"12/03",mod:"Futebol Masculino",rep:"Jotavê / Fala Porco",viagem:false,posts:4,nums:4157000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j8",evento:"São Paulo x Chapecoense",data:"12/03",mod:"Futebol Masculino",rep:"Igor Betinassi",viagem:false,posts:2,nums:2385000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j9",evento:"Vitória x Atlético-MG",data:"14/03",mod:"Futebol Masculino",rep:"Vitu Vitória",viagem:false,posts:1,nums:1700000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j10",evento:"Botafogo x Flamengo",data:"14/03",mod:"Futebol Masculino",rep:"Roger Terra",viagem:false,posts:3,nums:2359000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j11",evento:"Santos x Corinthians",data:"15/03",mod:"Futebol Masculino",rep:"Ellen / Linex",viagem:false,posts:4,nums:7800000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j12",evento:"Fluminense x Athletico",data:"15/03",mod:"Futebol Masculino",rep:"VH",viagem:false,posts:4,nums:1830000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j13",evento:"Palmeiras x Mirassol",data:"15/03",mod:"Futebol Masculino",rep:"Fala Porco",viagem:false,posts:3,nums:1312000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j14",evento:"Cruzeiro x Vasco da Gama",data:"15/03",mod:"Futebol Masculino",rep:"Carla Pessoa",viagem:false,posts:1,nums:956000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j15",evento:"Red Bull Bragantino x São Paulo",data:"15/03",mod:"Futebol Masculino",rep:"Pedro Cunha",viagem:false,posts:6,nums:3474000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j16",evento:"São Paulo x Palmeiras",data:"21/03",mod:"Futebol Masculino",rep:"Igor Betinassi / Fala Porco",viagem:false,posts:9,nums:16931000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""},
      {id:"j17",evento:"Corinthians x Flamengo",data:"22/03",mod:"Olímpicos",rep:"Ellen / Luiza Romar",viagem:false,posts:9,nums:5150000,prog:"Redes",ao:0,bol:0,yt:0,pauta:""}
    ]
  }
};

let redis;
try { redis = Redis.fromEnv(); } catch { redis = null; }

export async function GET() {
  try {
    if (redis) {
      let data = await redis.get("cazetv_data");
      if (!data) {
        await redis.set("cazetv_data", JSON.stringify(SEED));
        return NextResponse.json(SEED);
      }
      return NextResponse.json(typeof data === "string" ? JSON.parse(data) : data);
    }
  } catch {}
  return NextResponse.json(SEED);
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (redis) await redis.set("cazetv_data", JSON.stringify(body));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
