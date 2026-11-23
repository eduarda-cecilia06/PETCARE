import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import type { Evento, Pet } from './types';
import { ESPECIE_LABEL, TIPO_LABEL, calcularIdade, formatarReal, isoParaDataBR, normalizarEspecie, normalizarTipo, parseLocal } from '../utils/format';

const esc = (t: any) =>
  String(t ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export type FiltroRelatorio = { pet: Pet; eventos: Evento[]; inicio: Date | null; fim: Date | null; tutor?: string };

export function filtrarPeriodo(eventos: Evento[], inicio: Date | null, fim: Date | null) {
  return eventos.filter((e) => {
    const d = parseLocal(e.data);
    if (!d) return false;
    if (inicio && d < inicio) return false;
    if (fim && d > new Date(fim.getFullYear(), fim.getMonth(), fim.getDate(), 23, 59)) return false;
    return true;
  });
}

export function montarHtml({ pet, eventos, inicio, fim, tutor }: FiltroRelatorio) {
  const lista = filtrarPeriodo(eventos, inicio, fim).sort((a, b) => (parseLocal(a.data)?.getTime() || 0) - (parseLocal(b.data)?.getTime() || 0));
  const total = lista.reduce((acc, e) => acc + Number(e.custo || 0), 0);
  const periodo =
    inicio || fim ? `${inicio ? inicio.toLocaleDateString('pt-BR') : 'início'} a ${fim ? fim.toLocaleDateString('pt-BR') : 'hoje'}` : 'Todo o histórico';

  const linhas = lista
    .map(
      (e) => `<tr>
        <td>${esc(isoParaDataBR(e.data))}</td>
        <td>${esc(TIPO_LABEL[normalizarTipo(e.tipo)] || e.tipo)}</td>
        <td>${esc(e.nome)}${e.descricao ? `<br/><small>${esc(e.descricao)}</small>` : ''}</td>
        <td>${e.proxima_dose ? esc(isoParaDataBR(e.proxima_dose)) : '—'}</td>
        <td style="text-align:right">${e.custo ? esc(formatarReal(e.custo)) : '—'}</td>
      </tr>`
    )
    .join('');

  const porTipo: Record<string, number> = {};
  lista.forEach((e) => {
    const t = TIPO_LABEL[normalizarTipo(e.tipo)] || e.tipo;
    porTipo[t] = (porTipo[t] || 0) + Number(e.custo || 0);
  });
  const resumo = Object.entries(porTipo)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `<li>${esc(k)}: <b>${esc(formatarReal(v))}</b></li>`)
    .join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    body{font-family:Helvetica,Arial,sans-serif;color:#0f172a;padding:28px}
    h1{color:#15803d;margin:0 0 4px} h2{margin:22px 0 8px;font-size:16px}
    .sub{color:#64748b;font-size:12px} .box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px 14px;margin-top:14px;font-size:13px;line-height:1.7}
    table{width:100%;border-collapse:collapse;font-size:12px} th{background:#dcfce7;text-align:left;padding:8px} td{padding:8px;border-bottom:1px solid #e2e8f0;vertical-align:top}
    small{color:#64748b} .total{margin-top:12px;text-align:right;font-size:14px}
  </style></head><body>
    <h1>PetCare — Relatório de Saúde</h1>
    <div class="sub">Gerado em ${new Date().toLocaleString('pt-BR')}${tutor ? ' • Tutor: ' + esc(tutor) : ''}</div>
    <div class="box">
      <b>${esc(pet.nome)}</b> — ${esc(ESPECIE_LABEL[normalizarEspecie(pet.especie)] || pet.especie)}${pet.raca ? ' • ' + esc(pet.raca) : ''}<br/>
      ${pet.genero ? 'Gênero: ' + esc(pet.genero) + ' • ' : ''}${pet.data_nascimento ? 'Nascimento: ' + esc(isoParaDataBR(pet.data_nascimento)) + ' (' + esc(calcularIdade(pet.data_nascimento)) + ')' : ''}${pet.peso ? ' • Peso: ' + esc(pet.peso) + ' kg' : ''}<br/>
      Período: ${esc(periodo)}
    </div>
    <h2>Histórico de cuidados (${lista.length})</h2>
    ${lista.length ? `<table><tr><th>Data</th><th>Tipo</th><th>Evento</th><th>Próxima dose</th><th style="text-align:right">Valor</th></tr>${linhas}</table>` : '<p>Nenhum evento no período.</p>'}
    ${resumo ? `<h2>Gastos por tipo</h2><ul>${resumo}</ul>` : ''}
    <div class="total">Total no período: <b>${esc(formatarReal(total))}</b></div>
  </body></html>`;
}


export async function gerarPdf(f: FiltroRelatorio) {
  const { uri } = await Print.printToFileAsync({ html: montarHtml(f) });
  return uri;
}


export async function compartilharPdf(uri: string) {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Compartilhamento não disponível neste dispositivo.');
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Compartilhar relatório com o veterinário', UTI: 'com.adobe.pdf' });
}
