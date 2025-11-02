export const ajustarHorarioBrasil = (horaUTC, status = "proxima") => {
    if (!horaUTC) return status === "proxima" ? "--" : "--:--";
    const [hours, minutes] = horaUTC.split(':');
    let horasBrasil = parseInt(hours) - 3;
    if (horasBrasil < 0) horasBrasil += 24;
    return `${horasBrasil.toString().padStart(2, '0')}:${minutes}`;
};

export const formatarData = (dataString) => {
    if (!dataString) return "Data não disponível";
    const dataAjustada = new Date(dataString + 'T12:00:00Z');
    return dataAjustada.toLocaleDateString("pt-BR", { weekday: 'short', day: '2-digit', month: '2-digit' });
};