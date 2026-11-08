function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Dados");          // aba das leituras
  var data = JSON.parse(e.postData.contents);
  var agora = new Date();
  sheet.appendRow([agora, data.sensor, data.valor]);

  // ---- NOVO: ALERTA POR E-MAIL ----
  var DESTINOS = "alessandrohoras@umc.br, oscarevangelista@umc.br, igormorihirohajime@gmail.com";
  var ALUNO = "Igor Morihiro Hajime - 7b";
  if (data.sensor == "Temperatura" && data.valor > 35) {
    var memoria = PropertiesService.getScriptProperties();
    var ultimo = Number(memoria.getProperty("ultimoAlerta") || 0);
    var dezMinutos = 10 * 60 * 1000;
    if (Date.now() - ultimo > dezMinutos) {        // no máximo 1 e-mail a cada 10 min
      MailApp.sendEmail(
        DESTINOS,                                  // para os professores
        "Alerta IoT (" + ALUNO + "): temperatura alta",
        "Aluno(a): " + ALUNO + "\nA temperatura chegou a " + data.valor + " °C em " + agora
      );
      memoria.setProperty("ultimoAlerta", String(Date.now()));
    }
  }

  return ContentService
    .createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

// NOVO: o ESP32 pergunta "qual o comando?" e a planilha responde
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var controle = ss.getSheetByName("Controle");    // aba do controle
  var comando = String(controle.getRange("B1").getValue()).trim().toUpperCase();
  return ContentService
    .createTextOutput(comando)                     // responde "ON" ou "OFF"
    .setMimeType(ContentService.MimeType.TEXT);
}