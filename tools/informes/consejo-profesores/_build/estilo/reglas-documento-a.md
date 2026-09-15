# Reglas de redacción del Documento A

Informe para el Consejo de Profesores de la Escuela de Derecho de la PUCV. El director pidió un documento tradicional, fácil de leer y con redacción que no se parezca a la de un modelo de lenguaje. Estas reglas mandan sobre cualquier costumbre del redactor.

## 1. Registro

- Informe académico e institucional chileno, en español de Chile y con sobriedad.
- Voz impersonal («se examinó», «el informe registra») o tercera persona («este documento»). La primera persona solo aparece en la presentación, cuando el autor declara su interés.
- El lector es un profesor de Derecho sin formación estadística. Todo término técnico se explica la primera vez con palabras comunes.

## 2. Oración y párrafo

- Media de 20 a 30 palabras por oración, con variación natural. Evitar las oraciones de cinco palabras o menos.
- Párrafos de 60 a 150 palabras. Cada uno desarrolla una sola idea y la sostiene con su dato.
- Conectores académicos variados («por otra parte», «con todo», «en este sentido», «sin embargo», «de ahí que», «a su vez»). Ninguno más de dos veces por capítulo.
- Las listas se reservan para enumeraciones reales: como máximo una por capítulo, salvo en la síntesis. Lo que puede decirse en prosa va en prosa.

## 3. Títulos

Descriptivos y numerados: «I. Introducción», «1. Un fenómeno reciente», «1.1. Unidades y normas». Sin dos puntos, sin metáforas, sin preguntas y sin frases ingeniosas.

## 4. Rasgos prohibidos

| Rasgo | Ejemplo que no debe aparecer | Cómo se escribe en su lugar |
|---|---|---|
| Antítesis correctiva | «No es que no se haya encontrado la medición: es que ninguna se ha financiado.» | «No consta ningún proyecto financiado para medir ese efecto.» |
| Fragmento para enfatizar | «Nadie verifica.» | «Ninguna institución chilena tiene hoy la función de verificar lo que las facultades informan sobre esta materia.» |
| Remate con moraleja | «…no mejorará su posición: creará la categoría.» | Terminar el párrafo con el dato o su consecuencia verificable. |
| Metáfora | «la ventana», «la costura», «el eslabón», «la punta del iceberg», «hoja de ruta», «ecosistema» | Nombrar la cosa: «el plazo», «la relación entre ambos informes». |
| Comentario del texto sobre sí mismo | «Lo que este informe no dice, y conviene que quede escrito» | Decir directamente lo que se afirma o se descarta. |
| Muletillas | «exactamente», «precisamente», «conviene», «crucial», «sin duda», «en definitiva», «no solo… sino también» repetido | Suprimir o reemplazar por la afirmación simple. |
| Negritas para enfatizar | «**De forma general.**» | Sin negritas en el cuerpo. |
| Tríadas rítmicas | «existen, se implementan y se adoptan» como cierre retórico | Enumerar solo cuando cada elemento aporta información. |
| Preguntas retóricas | «¿Qué significa esto para la Escuela?» | Afirmar. |
| «Y» o «Pero» al inicio de oración | «Y no ocurre porque falte el instrumento.» | Unir con la oración anterior o reformular. |

Metas medibles (se comprueban con `node medir-estilo.mjs <archivo>`): cero antítesis, cero negritas, cero títulos con dos puntos, rayas por debajo de 1 por cada 1.000 palabras, dos puntos por debajo de 5 por cada 1.000, «…y no…» por debajo de 1,5 por cada 1.000, y ninguna muletilla de la lista en exceso.

## 5. Cifras, fechas y nombres

- Coma decimal y punto de miles: 68,9; 49.014; 473.162.000.
- Porcentaje con espacio: 47 %.
- Fechas completas: 6 de julio de 2026.
- El índice y sus subíndices van con un decimal. En el resto del cuerpo se redondea cuando la precisión no aporta («unos 473 millones de pesos»); la cifra exacta queda en el anexo o en la nota.
- Primera mención completa de cada institución (Pontificia Universidad Católica de Chile) y después la forma breve (Universidad Católica de Chile o UC). Siglas definidas en su primera aparición (ANID, CNA, PUCV).

## 6. Incertidumbre

Se explica una sola vez, en el capítulo II: el informe mide lo que consta en fuentes públicas, y la falta de evidencia pública no prueba que algo no exista. En los demás capítulos bastan fórmulas breves y variadas: «no consta públicamente», «no se localizó», «la fuente no permite afirmar». La advertencia de que ANID registra adjudicaciones y no postulaciones se dice una vez.

## 7. Notas al pie

Una nota para la fuente principal de cada hecho relevante, con la llamada después del signo de puntuación. Formatos:

- Documento o página institucional: INSTITUCIÓN (año): *Título del documento o de la página*. Disponible en: dirección [fecha de consulta: 6 de septiembre de 2026].
- Noticia: MEDIO (fecha): «Título de la nota». Disponible en: dirección.
- Artículo: APELLIDO APELLIDO, Nombre (año): «Título del artículo», *Revista*, vol., n.º, pp.
- Proyecto ANID: ANID, Fondecyt Regular 2026, proyecto n.º 1262567, investigador responsable Nombre Apellido.
- Norma: Ley n.º 21.719, que regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales, *Diario Oficial*, 13 de diciembre de 2024.
- Informe experto de base: OJEDA CIFUENTES, Diego Hernán (2026): *Uso y enseñanza de inteligencia artificial en las Escuelas de Derecho de Chile*, versión 3.2.0, corte al 6 de septiembre de 2026, sección o anexo que corresponda.

Cuando la fuente es de la segunda ronda de búsqueda, la nota lo dice: «Fuente de la segunda ronda de búsqueda, sin contraste con su publicación original». Si su dirección no respondía al corte, se agrega: «La dirección publicada no respondía a la fecha de corte». Se admiten notas discursivas breves para un matiz que interrumpiría el texto, como máximo dos por capítulo.

## 8. Gráficos y tablas

Cada gráfico o tabla se anuncia en el texto antes de aparecer («el gráfico {{grafico:a05-ranking-icia}} muestra…») y se comenta en prosa: qué muestra, qué conviene no leer en él y qué dato destaca. No se repiten en el texto todos sus valores.

## 9. Control antes de entregar

1. `node medir-estilo.mjs <archivo>` sin alertas.
2. Relectura completa buscando los rasgos del punto 4 que la medición no detecta.
3. Cada `[^clave]` tiene su definición al final del archivo y cada definición se usa.
4. Cada `::grafico` usa un id que existe en `figuras/informe-01/` y cada `{{grafico:…}}` o `{{tabla:…}}` apunta a un id definido en el documento.
5. Ninguna cifra que no esté en los insumos indicados.
