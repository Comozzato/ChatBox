import moment from "moment-timezone";

export function inBusinessHours() {
  const now = moment().tz("America/Manaus"); // Data e hora no fuso horário de Manaus
  const currentHour = now.hour(); // Hora atual (24h)
  const currentDay = now.day(); // Dia da semana (0 = Domingo, 6 = Sábado)

  // Horário de expediente: Segunda a Sexta (9h-19h), Sábado (9h-17h)
  const isWeekday = currentDay >= 1 && currentDay <= 5; // Segunda a Sexta
  const isSaturday = currentDay === 6; // Sábado
  const isSunday = currentDay === 0; // Domingo

  // Verificar se está dentro do horário de expediente
  const inBusinessHours =
    (isWeekday && currentHour >= 9 && currentHour < 10) || // Segunda a Sexta-feira (9h - 19h)
    (isSaturday && currentHour >= 9 && currentHour < 17); // Sábado (9h - 17h)
  return inBusinessHours;
}
