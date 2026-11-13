// Datos médicos para la ficha de emergencia.
// Son listas cerradas a propósito: así siempre tenemos la traducción japonesa
// correcta, incluso sin conexión. Lo que no está aquí va en "medicamentos" (texto libre).

export const conditions = [
  { id: 'diabetes', jp: '糖尿病', romaji: 'tōnyōbyō', name: 'Diabetes' },
  { id: 'asthma', jp: '喘息', romaji: 'zensoku', name: 'Asma' },
  { id: 'heart', jp: '心臓病', romaji: 'shinzōbyō', name: 'Enfermedad cardíaca' },
  { id: 'hypertension', jp: '高血圧', romaji: 'kōketsuatsu', name: 'Hipertensión' },
  { id: 'epilepsy', jp: 'てんかん', romaji: 'tenkan', name: 'Epilepsia' },
  { id: 'pregnant', jp: '妊娠中', romaji: 'ninshin-chū', name: 'Embarazo' },
];

export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// "A+" → "A型 Rh+" (así se escribe en Japón)
export function bloodTypeJp(type) {
  const sign = type.slice(-1);
  return `${type.slice(0, -1)}型 Rh${sign}`;
}
