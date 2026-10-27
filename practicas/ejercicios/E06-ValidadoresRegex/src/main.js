// E06 · Demostración de los validadores (no se modifica)
import {
  esDocumentoValido,
  esCodigoPostal,
  normalizarTelefono,
  esMatricula,
  extraerHashtags,
  ocultarCorreo,
} from './validadores.js';

const marca = (valido) => (valido ? '✅' : '❌');

console.log('🪪 Documentos');
for (const documento of [
  '12345678Z',
  '12345678A',
  '1234567Z',
  'X1234567L',
  'y-0000000-z',
  'W1234567L',
]) {
  console.log(`  ${marca(esDocumentoValido(documento))} ${documento}`);
}

console.log('📮 Códigos postales');
for (const codigo of ['41001', '01001', '52080', '53001', '00100', '4100']) {
  console.log(`  ${marca(esCodigoPostal(codigo))} ${codigo}`);
}

console.log('📞 Teléfonos');
for (const telefono of [
  '612345678',
  '+34 612-34-56-78',
  '0034 958.12.34.56',
  '512345678',
  '61234567',
]) {
  console.log(`  ${normalizarTelefono(telefono) ?? '❌ no válido'} ← «${telefono}»`);
}

console.log('🚗 Matrículas');
for (const matricula of ['1234BCD', '1234 bcd', '1234-XYZ', '1234ABC', '123BCD', '1234BCQ']) {
  console.log(`  ${marca(esMatricula(matricula))} ${matricula}`);
}

console.log('#️⃣ Hashtags');
console.log(
  `  ${JSON.stringify(extraerHashtags('Repasando #DWEC y #Eventos… ¡#dwec mola! dwec#2 #año_2'))}`,
);
console.log(`  ${JSON.stringify(extraerHashtags('Sin etiquetas'))}`);

console.log('📧 Correos');
for (const correo of ['ana.garcia@ejemplo.es', 'x@iesejemplo.org', 'sin-arroba.es']) {
  console.log(`  ${ocultarCorreo(correo) ?? '❌ no válido'} ← ${correo}`);
}
